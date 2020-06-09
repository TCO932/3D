Surfaces.prototype.cone = (count = 20, R = 3, color = 'FF0000') => {
    const points = [];
    const edges = [];
    const polygons = [];

    // Расставить точки
    const size = 10;
    const delta1 = size / count;
    const delta2 = Math.PI * 2 / count;
    for (let i = 0; i <= count; i ++) {
        for (let j = 0; j < Math.PI * 2; j+= delta2) {
            const x = (count - i) / count * R * Math.cos(j);
            const y = (count - i) / count * R * Math.sin(j);
            const z = i * delta1;
            points.push(new Point(x, y, z));
        }
    }
    // Провести ребра
    for (let i = 0; i < points.length; i++) {
        // Вдоль
        edges.push(new Edge())
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        } else if ((i + 1) % count === 0) {
            edges.push(new Edge(i, i + 1 - count));
        }
        // Поперек
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        }
    }
    // Заполнить полигоны
    for (let i = 0; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + count + 1, i + count], color));
        } else if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color));
        }
    }

    return new Subject(points, edges, polygons);
}