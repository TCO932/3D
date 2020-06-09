Surfaces.prototype.cube = (x = 0, y = 0, z = 0, size = 1, animation) => {
    return new Subject([
        new Point(x + size, y + size, z + size),//0
        new Point(x - size, y + size, z + size),//1
        new Point(x - size, y - size, z + size),//2
        new Point(x + size, y - size, z + size),//3
        new Point(x + size, y + size, z - size),//4
        new Point(x - size, y + size, z - size),//5
        new Point(x - size, y - size, z - size),//6
        new Point(x + size, y - size, z - size) //7
    ], [
        new Edge(0, 1),
        new Edge(1, 2),
        new Edge(2, 3),
        new Edge(3, 0),

        new Edge(4, 5),
        new Edge(5, 6),
        new Edge(6, 7),
        new Edge(7, 4),
        
        new Edge(0, 4),
        new Edge(1, 5),
        new Edge(2, 6),
        new Edge(3, 7)
    ], [
        new Polygon([0, 1, 2, 3], 'FF0000'),
        new Polygon([4, 5, 6, 7], 'FF0000'),
        new Polygon([0, 4, 7, 3], 'FF0000'),
        new Polygon([0, 1, 5, 4], 'FF0000'),
        new Polygon([1, 2, 6, 5], 'FF0000'),
        new Polygon([2, 3, 7, 6], 'FF0000')
    ], animation);
}