Surfaces.prototype.bublik = (
    count = 10,
    R = 10,
    point,
    color = 'FF0000',
    animation
) => {
    const points = [];
    const edges = [];
    const polygons = [];
    const da = 2 * Math.PI / count;
    const halfR = R / 2;
    for (let i = 0; i < 2 * Math.PI; i += da){
        const x = point.x + R * Math.cos(i);
        const y = point.y + R * Math.sin(i);
        const z = point.z;
        points.push(new Point(x, y, z));
    }

    for (let i = 0; i < 2 * Math.PI; i += da){
        const x = point.x + halfR * Math.cos(i);
        const y = point.y + halfR * Math.sin(i);
        const z = point.z;
        points.push(new Point(x, y, z));
    }

    for (let i = 1; i < count; i++) {
        edges.push(new Edge(i - 1, i));
    }
    edges.push(new Edge(0, count - 1));
    for (let i = count + 1; i < 2 * count; i++) {
        edges.push(new Edge(i - 1, i));
    }
    edges.push(new Edge(count, 2 * count - 1));
    for (let i = 0; i < count; i++) {
        edges.push(new Edge(i, i + count));
    }

    for (let i = 0; i < count - 1; i++) {
        polygons.push(new Polygon([i, i + 1, i + count + 1, i + count], color))
    }
    polygons.push(new Polygon([0, count, 2 * count - 1, count - 1], color));

    return new Subject(points, edges, polygons, animation);

}