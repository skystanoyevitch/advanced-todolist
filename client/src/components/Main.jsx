import { useEffect, useState } from "react";
import Modal from "./Modal";
import Nav from "./Nav";

function Main({ socket }) {
	
	const [todo, setTodo] = useState("");
	const [todoList, setTodoList] = useState([]);
	const [selectedItemId, setSelectedItemId] = useState("");
	const [showModal, setShowModal] = useState(false);
	
	const generateID = () => Math.random().toString(36).substring(2, 10);

	const toggleModal = (itemId) => {
		socket.emit("viewComments", itemId);
		setSelectedItemId(itemId);
		setShowModal(!showModal);
	};

	const handleAddTodo = (e) => {
		e.preventDefault();

		socket.emit("addTodo", {
			id: generateID(),
			todo,
			comments: [],
		});

		setTodo("");
	};

	useEffect(() => {
		function fetchTodos() {
			fetch("http://localhost:4000/api")
				.then((res) => res.json())
				.then((data) => setTodoList(data))
				.catch((err) => console.log(err));
		}
		fetchTodos();

		socket.on("todos", (data) => setTodoList(data));
	}, [socket]);

	const deleteTodo = (id) => socket.emit("deleteTodo", id);

	return (
		<div>
			<Nav />
			<form className="form" onSubmit={handleAddTodo}>
				<input
					value={todo}
					onChange={(e) => setTodo(e.target.value)}
					className="input"
					required
				/>

				<button className="form__cta">ADD TODO</button>
			</form>

			<div className="todo__container">
				{todoList.map((item) => (
					<div className="todo__item" key={item.id}>
						<p>{item.todo}</p>

						<div>
							<button
								className="commentsBtn"
								onClick={() => toggleModal(item.id)}
							>
								View Comments
							</button>

							<button
								className="deleteBtn"
								onClick={() => deleteTodo(item.id)}
							>
								DELETE
							</button>
						</div>
					</div>
				))}
			</div>
			{showModal ? (
				<Modal
					showModal={showModal}
					setShowModal={setShowModal}
					selectedItemId={selectedItemId}
					socket={socket}
				/>
			) : (
				""
			)}
		</div>
	);
}

export default Main;
