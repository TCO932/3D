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

    // Посчитатать центры всех полигонов объекта
    calcCenters(subject) {
        for (let i = 0; i < subject.polygons.length; i++) {
            const polygon = subject.polygons[i];
            const points = polygon.points;
            let x = 0, y = 0, z = 0;
            for (let j = 0; j < points.length; j++) {
                x += subject.points[points[j]].x;
                y += subject.points[points[j]].y;
                z += subject.points[points[j]].z;
            }
            polygon.center.x = x / points.length;
            polygon.center.y = y / points.length;
            polygon.center.z = z / points.length;
        }
    }

    // Расстояние от полигона до точки
    calcDistance(subject, endPoint, name) {
        for (let i = 0; i < subject.polygons.length; i++) {
            const polygon = subject.polygons[i];
            if (polygon.visible) {
                subject.polygons[i][name] = Math.sqrt(
                    Math.pow(endPoint.x - polygon.center.x, 2) +
                    Math.pow(endPoint.y - polygon.center.y, 2) +
                    Math.pow(endPoint.z - polygon.center.z, 2));
            }
        }
    }

    // Освещение
    calcIllumination(distance, lumen) {
        let illum = (distance) ? lumen / (distance * distance) : 1;
        return (illum > 1) ? 1 : illum;
    }

    // Тени
    calcShadow(polygon, subject, SCENE, LIGHT) {
        const M1 = polygon.center;
        const s = this.math.calcVector(M1, LIGHT);
        for (let i = 0; i < SCENE.length; i++) {
            if (subject.id !== SCENE[i].id) {
                for (let j = 0; j < SCENE[i].polygons.length; j++) {
                    const polygon2 = SCENE[i].polygons[j];
                    if (polygon2.visible) {
                        const M0 = polygon2.center;
                        // Если полигон сравнивается сам с собой
                        if (M1.x === M0.x && M1.y === M0.y && M1.z === M0.z) {
                            continue;
                        }
                        // Не учитывать полигоны, которые находятся дальше исходного
                        if (polygon2.lumen > polygon.lumen) {
                            continue;
                        }
                        const dark = this.math.calcVectorModule(
                            this.math.vectProd(this.math.calcVector(M0, M1), s)) / this.math.calcVectorModule(s);
        
                        if (dark < 0.5) {
                            return {
                                isShadow: true,
                                dark: dark / 10
                            };
                        } 
                    }
                }
            }
        }
        return {
            isShadow: false,
            dark: 1
        }
    }

    // Видимость полигонов
    calcGorner(subject, endPoint) {
        const perpendicular = Math.cos(Math.PI / 2);
        const viewVector = this.math.calcVector(endPoint, new Point(0, 0, 0));
        for (let i = 0; i < subject.polygons.length; i++) {
            const points = subject.polygons[i].points;
            const vector1 = this.math.calcVector(subject.points[points[0]], subject.points[points[1]]);
            const vector2 = this.math.calcVector(subject.points[points[0]], subject.points[points[2]]);
            const vector3 = this.math.vectProd(vector2, vector1);
            subject.polygons[i].visible = this.math.calcCorner(viewVector, vector3) <= perpendicular;
        }
    }

    calcPlaneEquation() {
        this.math.calcPlaneEquation(this.WINDOW.CAMERA, this.WINDOW.CENTER);
    }

    getProjection(point) {
        const M = this.math.getProjection(point);
        const P2M = this.math.calcVector(this.WINDOW.P2, M);
        const cosa = this.math.calcCorner(this.P2P1, M);
        const cosb = this.math.calcCorner(this.P2P3, M);
        const module = this.math.calcVectorModule(P2M);
        return {
            x: cosb * module,
            y: cosa * module,
        };
    }

    calcWindowVectors() {
        this.P2P1 = this.math.calcVector(this.WINDOW.P2, this.WINDOW.P1);
        this.P2P3 = this.math.calcVector(this.WINDOW.P2, this.WINDOW.P3);
    }
}