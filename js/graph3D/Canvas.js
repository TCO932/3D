class Canvas {
    constructor({ id, width = 300, height = 300, WINDOW, callbacks = {} }) {
        if (id) {
            this.canvas = document.getElementById(id)
        } else {
            this.canvas = document.createElement('canvas');
            document.querySelector('body').appendChild(this.canvas);
        }
        this.context = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;

        // Виртуальный канвас
        this.canvasV = document.createElement('canvas');
        this.contextV = this.canvasV.getContext('2d');
        this.canvasV.width = width;
        this.canvasV.height = height;

        this.WINDOW = WINDOW;
        this.PI2 = 2 * Math.PI;

        const wheel = callbacks.wheel instanceof Function ? callbacks.wheel : function () { };
        const mousemove = callbacks.mousemove instanceof Function ? callbacks.mousemove : function () { };
        const mouseup = callbacks.mouseup instanceof Function ? callbacks.mouseup : function () { };
        const mousedown = callbacks.mousedown instanceof Function ? callbacks.mousedown : function () { };
        const mouseleave = callbacks.wheel instanceof Function ? callbacks.mouseleave : function () { };
        this.canvas.addEventListener('wheel', wheel);
        this.canvas.addEventListener('mousemove', mousemove);
        this.canvas.addEventListener('mouseup', mouseup);
        this.canvas.addEventListener('mousedown', mousedown);
        this.canvas.addEventListener('mouseleave', mouseleave);
    }

    xS(x) {
        return (x - this.WINDOW.LEFT) / this.WINDOW.WIDTH * this.canvas.width;
    }

    yS(y) {
        return this.canvas.height - (this.canvas.height * (y - this.WINDOW.BOTTOM) / this.WINDOW.HEIGHT);
    }

    xSPolygon(x) {
        return x / this.WINDOW.WIDTH * this.canvas.width + this.canvas.width/2;
    }

    ySPolygon(y) {
        return this.canvas.height - y  / this.WINDOW.HEIGHT * this.canvas.height - this.canvas.height/2;
    }

    sx(x) {
        return x * this.WINDOW.WIDTH / this.canvas.width;
    }

    sy(y) {
        return -y * this.WINDOW.HEIGHT / this.canvas.height;
    }

    // Очистить
    clear() {
        this.contextV.fillStyle = '#000000';
        this.contextV.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Поставить точку
    point(x, y, color = '#f00', size = 1) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.arc(this.xS(x), this.yS(y), size, 0, this.PI2);
        this.contextV.stroke();
    }

    // Провести линию
    line(x1, y1, x2, y2, color = '#0f0', width = 1) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.lineWidth = width;
        this.contextV.moveTo(this.xS(x1), this.yS(y1));
        this.contextV.lineTo(this.xS(x2), this.yS(y2));
        this.contextV.stroke();
    }

    // Вывести текст (FPS)
    text(x = 5, y = 30, text, font = '25px bold Arial', color = '#0f0') {
        this.contextV.fillStyle = color;
        this.contextV.font = font;
        this.contextV.fillText('FPS:' + text, x, y)
    }

    // Нарисовать полигон
    polygon(points, color = '#008800BB') {
        this.contextV.fillStyle = color;
        this.contextV.strokeStyle = color;
        this.contextV.beginPath();
        this.contextV.moveTo(this.xSPolygon(points[0].x), this.ySPolygon(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.contextV.lineTo(this.xSPolygon(points[i].x), this.ySPolygon(points[i].y));
        }
        this.contextV.closePath();
        this.contextV.stroke();
        this.contextV.fill();
    }

    render() {
        this.context.drawImage(this.canvasV, 0, 0);
    }
}