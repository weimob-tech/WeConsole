import type { MpComponentProperties } from 'typescript-mp-component';
import { MpComponent } from 'typescript-mp-component';
import { JSONType } from '@/types/json';
import { registerClassComponent } from '@/sub/mixins/component';
import type { MpEvent } from '@/types/view';

interface Props {
    data: {
        open?: boolean;
        path?: string;
        type: JSONType;
    };
    fontSize: number;
    smallFontSize: number;
    outerClass: string;
}

class JsonNode extends MpComponent<Record<string, never>, Props> {
    properties: MpComponentProperties<Props, JsonNode> = {
        data: Object,
        fontSize: Number,
        smallFontSize: Number,
        outerClass: String
    };
    tapRow(e: MpEvent) {
        if (e.currentTarget.dataset.tv === 'compute') {
            return;
        }
        this.tap();
    }
    tapChunkRow(e) {
        if (e.currentTarget.dataset.tv !== 'compute') {
            return;
        }
        this.tapChunk();
    }
    tap() {
        this.triggerEvent('toggle', {
            open: !this.data.data.open,
            path: this.data.data.path
        });
    }
    tapChunk() {
        if (this.data.data.type === JSONType.compute) {
            this.triggerEvent('toggle', {
                path: this.data.data.path,
                fromCompute: true
            });
        }
    }
    toggle(e) {
        this.triggerEvent('toggle', e.detail);
    }
}

registerClassComponent(JsonNode);
