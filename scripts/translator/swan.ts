import type { FxNode } from 'forgiving-xml-parser';
import { serialize } from 'forgiving-xml-parser';
import { parseXML } from './parse';

const translatorAttr = (attr: FxNode, node: FxNode) => {
    if (attr.name?.startsWith('wx:')) {
        attr.name = `s-${attr.name.substring(3)}`;
        if (attr.name === 's-for' || attr.name === 's-if' || attr.name === 's-elif') {
            // 百度条件和循环没有{{}}
            let content = attr.content as string;
            content = content.substring(2, content.length - 2).trim();
            attr.content = content;
            return;
        }
        return;
    }
    if ((node.name === 'include' || node.name === 'import') && attr.name === 'src' && attr.content) {
        attr.content = `${attr.content.substring(0, attr.content.length - 5)}.swan`;
        return;
    }

    if (node.name === 'wxs' && attr.name === 'src' && attr.content) {
        attr.content = `${attr.content.substring(0, attr.content.length - 4)}.sjs`;
        return;
    }

    if (node.name === 'template' && attr.name === 'data') {
        let content = (attr.content as string).trim();
        content = content.substring(2, content.length - 2);
        if (content.startsWith('...')) {
            return;
        }
        const newContent = content
            .split(',')
            .reduce((sum: string[], item) => {
                const arr = item.trim().split(':');
                if (arr.length) {
                    sum.push(`${arr[0]}:${arr[1] || arr[0]}`);
                }
                return sum;
            }, [])
            .join(', ');
        // 百度手动添加大括号
        attr.content = `{{ {${newContent}} }}`;
    }
};

const loopTranslator = (nodes: FxNode[]) => {
    nodes.forEach((node) => {
        if (node.attrs) {
            let forAttr;
            let keyAttr;
            let forItemAttr;
            let forIndexAttr;
            node.attrs.forEach((attr) => {
                forAttr = attr.name === 'wx:for' ? attr : forAttr;
                forItemAttr = attr.name === 'wx:for-item' ? attr : forItemAttr;
                forIndexAttr = attr.name === 'wx:for-index' ? attr : forIndexAttr;
                keyAttr = attr.name === 'wx:key' ? attr : keyAttr;
                translatorAttr(attr, node);
            });
            if (keyAttr && forAttr) {
                // 百度key需要放到trackBy中
                let keyName;
                if (keyAttr.content === '*this') {
                    keyName = forItemAttr?.content || 'item';
                } else {
                    if (forIndexAttr) {
                        keyName = keyAttr.content === forIndexAttr.content ? forIndexAttr.content : '';
                    }
                    if (!keyName) {
                        keyName = `${forItemAttr?.content || 'item'}.${keyAttr.content}`;
                    }
                }
                forAttr.content += ` trackBy ${keyName}`;
            }
        }
        if (node.name === 'wxs') {
            node.name = 'import-sjs';
        }
        if (node.children) {
            loopTranslator(node.children);
        }
    });
};

export const toSwanXML = (wxml: string): string => {
    const wxmlNodes = parseXML(wxml);
    loopTranslator(wxmlNodes);
    return serialize(wxmlNodes);
};
