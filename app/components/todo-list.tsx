"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [randomChars, setRandomChars] = useState<JSX.Element[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const todoRefs = useRef<(HTMLLIElement | null)[]>([]);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    const index = todos.findIndex((todo) => todo.id === id);
    setTodos(todos.filter((todo) => todo.id !== id));
    if (selectedTodoId === id) {
      if (index < todos.length - 1) {
        setSelectedTodoId(todos[index + 1].id);
        setTimeout(() => todoRefs.current[index]?.focus(), 0);
      } else if (index > 0) {
        setSelectedTodoId(todos[index - 1].id);
        setTimeout(() => todoRefs.current[index - 1]?.focus(), 0);
      } else {
        setSelectedTodoId(null);
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLUListElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && document.activeElement === inputRef.current) {
      addTodo();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentIndex = todos.findIndex(
        (todo) => todo.id === selectedTodoId
      );
      let newIndex = currentIndex;
      if (e.key === "ArrowUp") {
        if (currentIndex === 0 || currentIndex === -1) {
          inputRef.current?.focus();
          setSelectedTodoId(null);
          return;
        }
        newIndex = currentIndex > 0 ? currentIndex - 1 : todos.length - 1;
      } else {
        newIndex = currentIndex < todos.length - 1 ? currentIndex + 1 : 0;
      }
      setSelectedTodoId(todos[newIndex]?.id || null);
      todoRefs.current[newIndex]?.focus();
    } else if (e.key === "Enter" && selectedTodoId !== null) {
      toggleTodo(selectedTodoId);
    } else if (
      (e.key === "Backspace" || e.key === "Delete") &&
      selectedTodoId !== null
    ) {
      deleteTodo(selectedTodoId);
    }
  };

  useEffect(() => {
    todoRefs.current = todoRefs.current.slice(0, todos.length);
  }, [todos]);

  useEffect(() => {
    const chars = Array.from({ length: 100 }).map((_, i) => (
      <span
        key={i}
        className="matrix-char absolute text-2xl"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `fall ${5 + Math.random() * 10}s linear infinite`,
        }}
      >
        {String.fromCharCode(33 + Math.floor(Math.random() * 94))}
      </span>
    ));
    setRandomChars(chars);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 overflow-hidden relative">
      <div className="absolute inset-0 opacity-20">{randomChars}</div>
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl p-8 shadow-[0_0_20px_rgba(0,255,0,0.3)] relative z-10 transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold mb-6 text-center text-green-400 shadow-text animate-pulse">
          Matrix Todo
        </h1>
        <div className="flex mb-4">
          <input
            ref={inputRef}
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow mr-2 px-4 py-2 bg-gray-800 text-green-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-300 hover:shadow-[inset_0_2px_8px_rgba(0,255,0,0.2)]"
            placeholder="Enter a new task"
            autoFocus
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-green-700 text-black rounded-md hover:bg-green-600 transition-all duration-300 ease-in-out shadow-[0_4px_6px_rgba(0,255,0,0.1),0_1px_3px_rgba(0,255,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,255,0,0.2),0_2px_4px_rgba(0,255,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
          >
            <Plus size={20} />
          </button>
        </div>
        <ul className="space-y-2" onKeyDown={handleKeyDown}>
          {todos.map((todo, index) => (
            <li
              key={todo.id}
              ref={(el) => {
                todoRefs.current[index] = el;
              }}
              tabIndex={0}
              className={`flex items-center bg-gray-800 rounded-md p-2 shadow-[0_4px_6px_rgba(0,255,0,0.1),0_1px_3px_rgba(0,255,0,0.1)] transition-all duration-300 ${
                selectedTodoId === todo.id
                  ? "ring-2 ring-green-500 scale-105"
                  : "hover:shadow-[0_6px_8px_rgba(0,255,0,0.2),0_2px_4px_rgba(0,255,0,0.2)] hover:scale-102"
              }`}
              onClick={() => setSelectedTodoId(todo.id)}
            >
              <div className="flex mr-2 relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="appearance-none w-5 h-5 border-2 border-green-500 rounded-md bg-gray-800 checked:bg-green-700 transition-colors duration-200 ease-in-out cursor-pointer"
                />
                <CheckCircle2
                  size={20}
                  className={`absolute top-0 left-0 text-green-400 pointer-events-none ${
                    todo.completed ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <span
                className={`flex-grow cursor-pointer ${
                  todo.completed ? "line-through text-green-700" : ""
                } transition-all duration-300`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-400 ml-2 flex-shrink-0 transition-colors duration-300"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        .shadow-text {
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.7),
            0 0 20px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3);
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
