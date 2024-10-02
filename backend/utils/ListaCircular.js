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

    // Método para agregar un nodo al final de la lista
    insertar(value) {
        const newNode = new Node(value);

        if (!this.head) {
            // Si la lista está vacía, head y tail son el mismo nodo
            this.head = newNode;
            this.tail = newNode;
            this.tail.next = this.head; // La cola apunta al principio para hacerla circular
        } else {
            this.tail.next = newNode; // El último nodo apunta al nuevo nodo
            this.tail = newNode; // Actualizamos el nodo final
            this.tail.next = this.head; // El nuevo nodo final apunta al head para mantener la circularidad
        }
    }

    // Método para crear una lista enlazada circular a partir de un arreglo
    cargarArreglo(arr) {
        arr.forEach(element => this.insertar(element));
    }

    // Método para imprimir la lista circular (deteniéndose después de una vuelta completa)
    print() {
        if (!this.head) return;

        let current = this.head;
        do {
            console.log(current.value);
            current = current.next;
        } while (current !== this.head);
    }
    recorrer(callback) {
        if (!this.head) return;
        let current = this.head;


        do {
            callback(current.value);
            current = current.next;
        } while (current !== this.head);
    }
}
    

module.exports = ListaCircular