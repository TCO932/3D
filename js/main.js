window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function () {
    const WINDOW = {
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        P1: new Point(-10,  10, -30), // Левый верхний угол
        P2: new Point(-10, -10, -30), // Левый нижний угол
        P3: new Point( 10, -10, -30), // Правый нижний угол
        CENTER: new Point(0, 0, -20), // Центр окошка, через которое видно мир
        CAMERA: new Point(0, 0, -30)  // Точка из которой смотрим на мир
    }

    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;

    const sur = new Surfaces;
    const canvas = new Canvas({
        id: 'canvas',
        width: 500,
        height: 500,
        callbacks: { wheel, mouseup, mousedown, mousemove, mouseleave },
        WINDOW
    });

    const graph3D = new Graph3D({ WINDOW });
    const ui = new UI({ callbacks: { move, printPolygons, printEdges, printPoints } });

    const SCENE = [
        sur.sphere(30, 5, new Point(0, 0, 0), 'FFFF00', {  }),
        sur.sphere(30, 6, new Point(0, 50, 0), '#0080FF', { rotateOz: new Point }),
        sur.sphere(30, 1, new Point(0, 58, 0), '#838B8B', { rotateOz: new Point(0, 50, 0), rotateOz: new Point(0, 0, 0) }),
        sur.sphere(30, 8, new Point(120, 120, 0), '#BFB169', { rotateOz: new Point }),
        sur.bublik(30, 20, new Point(120, 120, 0), '#BFB169', { rotateOz: new Point }),

        //sur.cube(0, 0, 10, 2, { rotateOz: new Point }),        
        //sur.sphere(10, 1, new Point)        
    ];

    const LIGHT = new Light(25, 0, 0, 500); //Источник света
    let canRotate;

    let canPrint = {
        polygons: true,
        edges: false,
        points: false
    }

    function wheel(event) {
        /*
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        graph3D.zoomMatrix(delta);
        SCENE.forEach(subject => {
            subject.points.forEach(point => graph3D.transform(point));
            if (subject.animation) {
                for (let key in subject.animation) {
                    graph3D.transform(subject.animation[key]);
                }
            }
        }); 
        */
    }

    function mouseleave() {
        canRotate = false
    }

    function mouseup() {
        canRotate = false
    }

    function mousedown() {
        canRotate = true
    }

    function mousemove(event) {
        /*
        if (canRotate) {
            if (event.movementX) { // Крутить вокруг OY
                const alpha = canvas.sx(event.movementX) / WINDOW.CENTER.z;
                graph3D.rotateOyMatrix(4 * alpha);
                SCENE.forEach(subject => {
                    subject.points.forEach(point => graph3D.transform(point));
                    if (subject.animation) {
                        for (let key in subject.animation) {
                            graph3D.transform(subject.animation[key]);
                        }
                    }
                });
            }

            if (event.movementY) { // Крутить вокруг OX
                const alpha = canvas.sy(event.movementY) / -WINDOW.CENTER.z;
                graph3D.rotateOxMatrix(4 * alpha);
                SCENE.forEach(subject => {
                    subject.points.forEach(point => graph3D.transform(point));
                    if (subject.animation) {
                        for (let key in subject.animation) {
                            graph3D.transform(subject.animation[key]);
                        }
                    }
                });
            }
        }
        */
    }

    function printPolygons(value) {
        canPrint.polygons = value;
    }

    function printEdges(value) {
        canPrint.edges = value;

    }

    function printPoints(value) {
        canPrint.points = value;

    }

    function move(direction) {
        switch (direction) {
            case 'up': graph3D.rotateOxMatrix(Math.PI / 180); break;
            case 'down': graph3D.rotateOxMatrix(-Math.PI / 180); break;
            case 'left': graph3D.rotateOyMatrix(Math.PI / 180); break;
            case 'right': graph3D.rotateOyMatrix(-Math.PI / 180); break;
        }
        graph3D.transform(WINDOW.CAMERA);
        graph3D.transform(WINDOW.CENTER);
        graph3D.transform(WINDOW.P1);
        graph3D.transform(WINDOW.P2);
        graph3D.transform(WINDOW.P3);
    }

    // Нарисовать все полигоны
    function printAllPolygons() {
        if (canPrint.polygons) { // Полигоны
            const polygons = [];
            SCENE.forEach(subject => {
                //graph3D.calcGorner(subject, WINDOW.CAMERA); // Отсечь невидимые грани 
                graph3D.calcDistance(subject, WINDOW.CAMERA, 'distance');
                graph3D.calcDistance(subject, LIGHT, 'lumen');
                subject.polygons.forEach(polygon => {
                    if (polygon.visible) {
                        const point1 = graph3D.getProjection(subject.points[polygon.points[0]]);
                        const point2 = graph3D.getProjection(subject.points[polygon.points[1]]);
                        const point3 = graph3D.getProjection(subject.points[polygon.points[2]]);
                        const point4 = graph3D.getProjection(subject.points[polygon.points[3]]);
                        let { r, g, b } = polygon.color;
                        const lumen = graph3D.calcIllumination(polygon.lumen, LIGHT.lumen);
                        r = Math.round(r * lumen);
                        g = Math.round(g * lumen);
                        b = Math.round(b * lumen);
                        polygons.push({
                            points: [point1, point2, point3, point4],
                            color: polygon.rgbToHex(r, g, b),
                            distance: polygon.distance
                        });
                    }
                });
            });
            // Отрисовка всех полигонов
            polygons.sort((a, b) => b.distance - a.distance);
            polygons.forEach(polygon => canvas.polygon(polygon.points, polygon.color));
        }
    }

    function printSubject(subject) {
        if (canPrint.edges) { // Ребра
            subject.edges.forEach(edge => {
                const point1 = subject.points[edge.p1];
                const point2 = subject.points[edge.p2];
                canvas.line(
                    graph3D.xS(point1),
                    graph3D.yS(point1),
                    graph3D.xS(point2),
                    graph3D.yS(point2),
                );
            });
        }
        if (canPrint.points) { // Точки
            subject.points.forEach(point =>
                canvas.point(graph3D.xS(point), graph3D.yS(point))
            );
        }
    }

    function render() {
        canvas.clear();
        printAllPolygons();
        SCENE.forEach(subject => printSubject(subject))
        canvas.text(5, 30, FPSout);
        canvas.render();
    }

    function animation() {
        // Вращение фигур
        SCENE.forEach(subject => {
            if (subject.animation) {
                for (let key in subject.animation) {
                    const { x, y, z } = subject.animation[key];
                    const xn = WINDOW.CENTER.x - x;
                    const yn = WINDOW.CENTER.y - y;
                    const zn = WINDOW.CENTER.z - z;
                    /*// Переместить центр объекта в центр координат
                    graph3D.moveMatrix(xn, yn, zn);
                    subject.points.forEach(point => graph3D.transform(point))
                    // Повращать объект
                    const alpha = Math.PI / 180;
                    graph3D[`${key}Matrix`](alpha);
                    subject.points.forEach(point => graph3D.transform(point));
                    // Переместить центр объекта обратно
                    graph3D.moveMatrix(-xn, -yn, -zn);
                    subject.points.forEach(point => graph3D.transform(point))*/

                    const alpha = Math.PI / 180;
                    graph3D.animateMatrix(xn, yn, zn, key, alpha, -xn, -yn, -zn);
                    subject.points.forEach(point => graph3D.transform(point));
                }
            }
        });
    }

    setInterval(animation, 100)

    let FPS = 0;
    let FPSout = 0;
    let timestamp = (new Date()).getTime();

    (function animloop() {
        // Считаем FPS
        FPS++;
        const currentTimestemp = (new Date()).getTime();
        if (currentTimestemp - timestamp >= 1000) {
            timestamp = currentTimestemp;
            FPSout = FPS;
            FPS = 0;
        }
        graph3D.calcPlaneEquation(); // Получить и записать плоскость экрана
        graph3D.calcWindowVectors(); // Вычисляем вектора экрана
        render(); // Рисуем сцену
        requestAnimationFrame(animloop); // Зацикливаем отрисовку
    })();
}