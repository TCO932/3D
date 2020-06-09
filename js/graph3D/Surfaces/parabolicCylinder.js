Surfaces.prototype.parabolicCylinder = (count = 20) => {
    const points = [];
    const edges = [];
    const polygons = [];
    // y^2 = x
    // Расставить точки
    const size = 10;
    const delta = size / (count - 1);
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            const x = j * delta - size / 2 ;
            const y = x * x;
            const z = i;
            points.push(new Point(x, y, z));
        }
    }
    // Провести ребра
    for (let i = 0; i < points.length; i++) {
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        }
    }
    // Заполнить полигоны
    for (let i = 0; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + count + 1, i + count]));
        }
    }

    return new Subject(points, edges, polygons);
}