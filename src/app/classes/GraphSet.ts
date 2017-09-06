export class GraphSet {
    items: Array<GraphItem>;  
    minimum: number;
    beginAtZero: boolean;

    constructor() {
        this.items = new Array<GraphItem>();
        this.beginAtZero = false;
    }    

    addItem(label, source) {
        var item = new GraphItem(label, source);
        this.items.push(item);
    }

    addData(archive) {
        this.items.forEach((item: GraphItem) => {
            item.data.push(archive[item.source]);
        });
    }

    clear() {
        this.items.forEach(item => {
            item.data = new Array<number>();
        });
    }
}

export class GraphItem {
    constructor(label, source) {
        this.label = label;
        this.source = source;
        this.data = new Array<number>();
    }

    label: string;
    source: string;
    data: Array<number>;

    
}