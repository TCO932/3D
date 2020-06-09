class Graph3D {
    constructor({ WINDOW }) {
        this.WINDOW = WINDOW;
        this.math = new Math3D;
    }

    // Заполнение матриц
    zoomMatrix(delta) {
        this.math.transformMatrix([this.math.zoomMatrix(delta)])
    }
    moveMatrix(sx, sy, sz) {
        this.math.transformMatrix([this.math.moveMatrix(sx, sy, sz)])
    }
    rotateOxMatrix(alpha) {
        this.math.transformMatrix([this.math.rotateOxMatrix(alpha)])
    }
    rotateOyMatrix(alpha) {
        this.math.transformMatrix([this.math.rotateOyMatrix(alpha)])
    }
    rotateOzMatrix(alpha) {
        this.math.transformMatrix([this.math.rotateOzMatrix(alpha)])
    }

    animateMatrix(x1, y1, z1, key, alpha, x2, y2, z2) {
        this.math.transformMatrix([ 
            this.math.moveMatrix(x1, y1, z1),
            this.math[`${key}Matrix`](alpha),
            this.math.moveMatrix(x2, y2, z2),
        ]);
    }

    transform(point) {
        this.math.transform(point);
    }

    // Не нужны
    /*
    xS(point) {
        const zS = this.WINDOW.CENTER.z;
        const z0 = this.WINDOW.CAMERA.z;
        return point.x / (point.z - z0) * (zS - z0);
    }

    yS(point) {
        const zS = this.WINDOW.CENTER.z;
        const z0 = this.WINDOW.CAMERA.z;
        return point.y / (point.z - z0) * (zS - z0);
    }
    */

    // Расстояние до точки
    calcDistance(subject, endPoint, name) {
        for (let i = 0; i < subject.polygons.length; i++) {
            if (subject.polygons[i].visible) {
                const points = subject.polygons[i].points;
                let x = 0, y = 0, z = 0;
                for (let j = 0; j < points.length; j++) {
                    x += subject.points[points[j]].x;
                    y += subject.points[points[j]].y;
                    z += subject.points[points[j]].z;
                }
                x = x / points.length;
                y = y / points.length;
                z = z / points.length;
                const dist = Math.sqrt(
                    Math.pow(endPoint.x - x, 2) +
                    Math.pow(endPoint.y - y, 2) +
                    Math.pow(endPoint.z - z, 2)
                );
                subject.polygons[i][name] = dist;
            }
        }
    }

    // Освещение
    calcIllumination(distance, lumen) {
        let illum = (distance) ? lumen / (distance * distance) : 1;
        return (illum > 1) ? 1 : illum;
    }

    // Видимость полигонов
    calcGorner(subject, endPoint) {
        const perpendicular = Math.cos(Math.PI / 2);
        const viewVector = this.math.calcVector(endPoint, new Point(0, 0, 0));
        for (let i = 0; i < subject.polygons.length; i++) {
            const points = subject.polygons[i].points;
            const vector1 = this.math.calcVector(subject.points[points[0]], subject.points[points[1]]);
            const vector2 = this.math.calcVector(subject.points[points[0]], subject.points[points[2]]);
            const vector3 = this.math.vectProd(vector1, vector2);
            subject.polygons[i].visible = this.math.calcCorner(viewVector, vector3) >= perpendicular;
        }
    }

    calcPlaneEquation() {
        this.math.calcPlaneEquation(this.WINDOW.CAMERA, this.WINDOW.CENTER);
    }

    getProjection(point) {
        const M = this.math.getProjection(point);
        const P2M = this.math.calcVector(this.WINDOW.P2, M);
        const cosa = this.math.calcCorner(this.P1P2, M);
        const cosb = this.math.calcCorner(this.P2P3, M);
        const module = this.math.calcVectorModule(P2M);
        return {
            x: cosa * module,
            y: cosb * module,
        };
    }

    calcWindowVectors() {
        this.P1P2 = this.math.calcVector(this.WINDOW.P2, this.WINDOW.P1);
        this.P2P3 = this.math.calcVector(this.WINDOW.P3, this.WINDOW.P2);
    }
}