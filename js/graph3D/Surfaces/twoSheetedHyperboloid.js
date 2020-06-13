Surfaces.prototype.twoSheetedHyperboloid = (count = 8) => { 
    const points = [];
    const edges = [];
    const polygons = [];
    // x^2 + y^2 - z^2 = -1
    // Расставить точки
    const size = 10;
    const delta1 = Math.PI / 2 / count;
    const delta2 = Math.PI * 2 / count;
    for (let i = 0; i < Math.PI; i+= delta1) {
        for (let j = 0; j < Math.PI * 2; j+= delta2) {
            const x = Math.tan(i) * Math.cos(j);
            const y = Math.tan(i) * Math.sin(j);
            const z = 1 / Math.cos(i);
            points.push(new Point(x, y, z));
        }
    }

    // Провести ребра
    for (let i = 0; i < points.length; i++) {
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        } else if ((i + 1) % count === 0) {
            edges.push(new Edge(i, i + 1 - count));
        }
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        }
    }
    
    // Заполнить полигоны
    for (let i = 0; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + count + 1, i + count]));
        } else if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]));
        }
    }

    return new Subject(points, edges, polygons);
}