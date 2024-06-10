export function background(data) {
    return {
        backgroundColor: (data && data.color) ?? '#000',
        backgroundImage: (data && data.image) ? `url('${this.image(data.image)}')` : null,
        backgroundRepeat: (data && data.repeat) ?? 'no-repeat',
        backgroundPosition: this.position(data.image_position ?? 5),
        backgroundSize: (data && data.size) ?? 'cover',
        position: (data && data.position) ?? 'initial',
        width: (data && data.width) ?? 'initial',
        height: (data && data.height) ?? 'initial',
    };
}

export function image(url) {
    return url ? url.replace(/\\/g, '/') : '';
}

export function position(indx) {
    switch (indx) {
        case 1:
            return "top left";
        case 2:
            return "top center";
        case 3:
            return "top right";
        case 4:
            return "center left";
        case 5:
            return "center center";
        case 6:
            return "center right";
        case 7:
            return "bottom left";
        case 8:
            return "bottom center";
        case 9:
            return "bottom right";
        default:
            return "center center";
    }
}