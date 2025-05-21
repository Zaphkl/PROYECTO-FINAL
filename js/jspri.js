let usuarios = [
    { id: 1, nombre: "María González", rol: "profesor", departamento: "Matemáticas" },
    { id: 2, nombre: "Juan López", rol: "profesor", departamento: "Ciencias" },
    { id: 3, nombre: "Ana Martínez", rol: "alumno", departamento: "3º A" },
    { id: 4, nombre: "Pedro Rodríguez", rol: "alumno", departamento: "2º B" },
    { id: 5, nombre: "Luisa Fernández", rol: "admin", departamento: "Secretaría" },
    { id: 6, nombre: "Carlos Sánchez", rol: "admin", departamento: "Dirección" }
];

const vistaInicio = document.getElementById('home-view');
const vistaRoles = document.getElementById('roles-view');
const vistaAcerca = document.getElementById('about-view');
const modalUsuario = document.getElementById('user-modal');
const modalEliminar = document.getElementById('delete-modal');
const formularioUsuario = document.getElementById('user-form');
const cuerpoTablaUsuarios = document.getElementById('users-table-body');
const notificacion = document.getElementById('notification');

document.getElementById('nav-home').addEventListener('click', mostrarVistaInicio);
document.getElementById('nav-roles').addEventListener('click', mostrarVistaRoles);
document.getElementById('nav-about').addEventListener('click', mostrarVistaAcerca);
document.getElementById('go-to-roles').addEventListener('click', mostrarVistaRoles);

document.getElementById('add-user-btn').addEventListener('click', abrirModalAgregarUsuario);
document.getElementById('search-btn').addEventListener('click', buscarUsuarios);
document.getElementById('confirm-delete').addEventListener('click', eliminarUsuario);
document.getElementById('cancel-delete').addEventListener('click', cerrarModalEliminar);

document.querySelectorAll('.close').forEach(botonCerrar => {
    botonCerrar.addEventListener('click', function () {
        modalUsuario.style.display = 'none';
        modalEliminar.style.display = 'none';
    });
});

window.addEventListener('click', function (evento) {
    if (evento.target === modalUsuario) {
        modalUsuario.style.display = 'none';
    }
    if (evento.target === modalEliminar) {
        modalEliminar.style.display = 'none';
    }
});

formularioUsuario.addEventListener('submit', guardarUsuario);

function inicializar() {
    renderizarTablaUsuarios();
    actualizarEstadisticas();
    mostrarVistaInicio();
}

function mostrarVistaInicio() {
    vistaInicio.style.display = 'block';
    vistaRoles.style.display = 'none';
    vistaAcerca.style.display = 'none';
    actualizarEstadisticas();
}

function mostrarVistaRoles() {
    vistaInicio.style.display = 'none';
    vistaRoles.style.display = 'block';
    vistaAcerca.style.display = 'none';
}

function mostrarVistaAcerca() {
    vistaInicio.style.display = 'none';
    vistaRoles.style.display = 'none';
    vistaAcerca.style.display = 'block';
}

function renderizarTablaUsuarios(usuariosFiltrados = null) {
    const usuariosAMostrar = usuariosFiltrados || usuarios;
    cuerpoTablaUsuarios.innerHTML = '';

    if (usuariosAMostrar.length === 0) {
        cuerpoTablaUsuarios.innerHTML = '<tr><td colspan="5" style="text-align:center;">No se encontraron usuarios</td></tr>';
        return;
    }

    usuariosAMostrar.forEach(usuario => {
        const fila = document.createElement('tr');

        let claseEtiqueta = '';
        switch (usuario.rol) {
            case 'profesor':
                claseEtiqueta = 'badge-profesor';
                break;
            case 'alumno':
                claseEtiqueta = 'badge-alumno';
                break;
            case 'admin':
                claseEtiqueta = 'badge-admin';
                break;
        }

        fila.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td><span class="badge ${claseEtiqueta}">${capitalizarPrimeraLetra(usuario.rol)}</span></td>
                    <td>${usuario.departamento}</td>
                    <td class="action-cell">
                        <button class="btn" onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button class="btn btn-danger" onclick="abrirModalEliminar(${usuario.id})">Eliminar</button>
                    </td>
                `;

        cuerpoTablaUsuarios.appendChild(fila);
    });
}

function actualizarEstadisticas() {
    const contadorProfesores = usuarios.filter(usuario => usuario.rol === 'profesor').length;
    const contadorAlumnos = usuarios.filter(usuario => usuario.rol === 'alumno').length;
    const contadorAdmin = usuarios.filter(usuario => usuario.rol === 'admin').length;

    document.getElementById('teacher-count').textContent = contadorProfesores;
    document.getElementById('student-count').textContent = contadorAlumnos;
    document.getElementById('admin-count').textContent = contadorAdmin;
}


function buscarUsuarios() {
    const terminoBusqueda = document.getElementById('search-input').value.toLowerCase();

    if (!terminoBusqueda.trim()) {
        renderizarTablaUsuarios();
        return;
    }

    const usuariosFiltrados = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(terminoBusqueda) ||
        usuario.rol.toLowerCase().includes(terminoBusqueda) ||
        usuario.departamento.toLowerCase().includes(terminoBusqueda)
    );

    renderizarTablaUsuarios(usuariosFiltrados);
}

function abrirModalAgregarUsuario() {
    document.getElementById('modal-title').textContent = 'Agregar Nuevo Usuario';
    document.getElementById('user-id').value = '';
    document.getElementById('user-name').value = '';
    document.getElementById('user-role').value = '';
    document.getElementById('user-department').value = '';
    modalUsuario.style.display = 'block';
}

function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        document.getElementById('modal-title').textContent = 'Editar Usuario';
        document.getElementById('user-id').value = usuario.id;
        document.getElementById('user-name').value = usuario.nombre;
        document.getElementById('user-role').value = usuario.rol;
        document.getElementById('user-department').value = usuario.departamento;
        modalUsuario.style.display = 'block';
    }
}

function guardarUsuario(e) {
    e.preventDefault();

    const idUsuario = document.getElementById('user-id').value;
    const nombreUsuario = document.getElementById('user-name').value;
    const rolUsuario = document.getElementById('user-role').value;
    const departamentoUsuario = document.getElementById('user-department').value;

    if (idUsuario) {

        const indice = usuarios.findIndex(u => u.id === parseInt(idUsuario));
        if (indice !== -1) {
            usuarios[indice] = {
                id: parseInt(idUsuario),
                nombre: nombreUsuario,
                rol: rolUsuario,
                departamento: departamentoUsuario
            };
            mostrarNotificacion('Usuario actualizado con éxito', 'success');
        }
    } else {

        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
        usuarios.push({
            id: nuevoId,
            nombre: nombreUsuario,
            rol: rolUsuario,
            departamento: departamentoUsuario
        });
        mostrarNotificacion('Usuario agregado con éxito', 'success');
    }

    modalUsuario.style.display = 'none';
    renderizarTablaUsuarios();
    actualizarEstadisticas();
}

function abrirModalEliminar(id) {
    document.getElementById('delete-user-id').value = id;
    modalEliminar.style.display = 'block';
}

function cerrarModalEliminar() {
    modalEliminar.style.display = 'none';
}


function eliminarUsuario() {
    const idUsuario = parseInt(document.getElementById('delete-user-id').value);
    const indice = usuarios.findIndex(u => u.id === idUsuario);

    if (indice !== -1) {
        usuarios.splice(indice, 1);
        mostrarNotificacion('Usuario eliminado con éxito', 'success');
        renderizarTablaUsuarios();
        actualizarEstadisticas();
    }

    modalEliminar.style.display = 'none';
}

function mostrarNotificacion(mensaje, tipo) {
    notificacion.textContent = mensaje;
    notificacion.className = `notification ${tipo}`;
    notificacion.style.display = 'block';

    setTimeout(() => {
        notificacion.style.display = 'none';
    }, 3000);
}

function capitalizarPrimeraLetra(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

window.editarUsuario = editarUsuario;
window.abrirModalEliminar = abrirModalEliminar;

inicializar();