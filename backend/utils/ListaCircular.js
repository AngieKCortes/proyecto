class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class ListaCircular {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    // Método para verificar si la lista está vacía
    isEmpty() {
        return this.head === null;
    }

    // Método para agregar un nodo al final de la lista
    insertar(value) {
        const newNode = new Node(value);

        if (this.isEmpty()) {
            // Si la lista está vacía, el nuevo nodo es tanto el head como el tail
            this.head = newNode;
            this.tail = newNode;
        } else {
            // Si la lista no está vacía, agregamos el nuevo nodo al final
            this.tail.next = newNode;
            this.tail = newNode;
        }

        // Siempre mantenemos la circularidad apuntando el último nodo al head
        this.tail.next = this.head;
    }

    // Método para crear una lista enlazada circular a partir de un arreglo
    cargarArreglo(arr) {
        arr.forEach(element => this.insertar(element));
    }

    // Método para recorrer la lista circular y aplicar un callback a cada nodo
    recorrer(callback) {
        if (this.isEmpty()) return;
        
        let current = this.head;
        do {
            callback(current.value);
            current = current.next;
        } while (current !== this.head);
    }

    // Método para imprimir la lista circular (deteniéndose después de una vuelta completa)
    print() {
        this.recorrer(value => console.log(value));
    }
}

module.exports = ListaCircular;
