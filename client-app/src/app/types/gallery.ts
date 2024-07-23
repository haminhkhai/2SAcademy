export interface Gallery {
    id: string;
    publicId: string;
    url: string;
    caption: string;
    height: number;
    width: number;
}

export class Gallery implements Gallery {
    id = "";
    publicId = "";
    url = "";
    caption = "";
    height = 0;
    width = 0;
    constructor (gallery?: Gallery) {
        if (gallery) {
            Object.assign(this, gallery);
        }
    }
}