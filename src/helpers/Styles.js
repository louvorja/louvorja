export function background(data) {
    return {
        backgroundColor: (data && data.color) ?? '#000',
        backgroundImage: (data && data.image) ? `url('${this.image(data.image)}')` : null,
        backgroundRepeat: (data && data.repeat) ?? 'no-repeat',
        backgroundPosition: (data && data.position) ?? 'center center',
        backgroundSize: (data && data.size) ?? 'cover',
    };
}

export function image(url) {
    return url ? url.replace(/\\/g, '/') : '';
}