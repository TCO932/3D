Surfaces.prototype.twoSheetedHyperboloid = (count = 20) => { 
    const points = [];
    const edges = [];
    const polygons = [];
    // x^2 + y^2 - z^2 = -1
    // Расставить точки
    const size = 10;
    const delta1 = size / count;
    const delta2 = Math.PI / count;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j+= delta2) {
            const x = Math.sinh(i * delta1 - size / 2) * Math.cos(j);
            const y = Math.sinh(i * delta1 - size / 2) * Math.sin(j);
            const z = Math.cosh(i * delta1 - size / 2);
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