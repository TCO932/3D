Surfaces.prototype.hyperbolicСylinder = (count = 20, point = new Point(0, 0, 0), color = 'FF0000') => {
    const points = [];
    const edges = [];
    const polygons = [];
    // 1 = x^2 - y^2
    // Расставить точки
    const size = 10;
    const delta = size / (count - 1);
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            const x = point.x + Math.sinh(j * delta - size / 2);
            const y = point.y + i;
            const z = point.z + Math.cosh(j * delta - size / 2);
            points.push(new Point(x, y, z));
        }
    }
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            const x = point.x + Math.sinh(j * delta - size / 2);
            const y = point.y + i;
            const z = point.z - Math.cosh(j * delta - size / 2);
            points.push(new Point(x, y, z));
        }
    }
    // Провести ребра
    for (let i = 0; i < count * count; i++) {
        if (i + 1 < count * count && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }
        if (i + count < count * count) {
            edges.push(new Edge(i, i + count));
        }
    }
    for (let i = count * count; i < points.length; i++) {
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        }
    }
    // Заполнить полигоны
    for (let i = 0; i < count * count; i++) {
        if (i + 1 + count < count * count && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + count + 1, i + count]));
        }
    }
    for (let i = count * count; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + count + 1, i + count]));
        }
    }

    return new Subject(points, edges, polygons);
}