export interface MpNode {
    name: string;
}
export interface MpAttrNode extends MpNode {
    content?: string;
}
export interface MpElement extends MpNode {
    id: string;
    attrs: MpAttrNode[];
    hasChild?: boolean;
    children?: MpElement[];
    open?: boolean;
    path?: string[];
}
