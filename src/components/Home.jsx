import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
	useNodesState,
	useEdgesState,
	addEdge,
	useReactFlow,
	ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import CreateNodeButton from "./CrateNodeButton";
import { SiCreatereactapp } from "react-icons/si";

import { CiRoute, CiSaveDown1 } from "react-icons/ci";

// import Node from "./Node";

/**
 * Get a unique ID
 * @return {string}
 */
let id = 0;
const getId = () => `${id++}`;

/**
 *
 */

const Home = () => {
	const reactFlowWrapper = useRef(null);
	const connectingNodeId = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedNode, setSelectedNode] = useState(null);
	const [hoveredNodeId, setHoveredNodeId] = useState(null);
	const [inputValue, setInputValue] = useState("");
	const { screenToFlowPosition } = useReactFlow();

	/**
	 * onConnect is called when the user connects two nodes.
	 * It is used to add an edge to the graph.
	 * @param params(object)
	 *
	 */
	const onConnect = useCallback((params) => {
		// reset the start node on connections
		connectingNodeId.current = null;
		setEdges((eds) => addEdge({ ...params, animated: true, eds }));
	}, []);

	/**
	 * onConnectStart is called when the user clicks on a node and it is used to set the current node that is being connected.
	 * It is also used to set the current node that is being connected.
	 * @param event(mouse event)
	 */
	const onConnectStart = useCallback((_, { nodeId }) => {
		connectingNodeId.current = nodeId;
	}, []);

	/**
	 * onConnectEnd is called when the user releases the mouse button
	 * when a connection is in progress.
	 * It is used to add a new node to the graph.
	 * It is also used to add an edge to the graph.
	 * @param event(mouse event)
	 * @param params(object)
	 *
	 */
	const onConnectEnd = useCallback(
		(event) => {
			if (!connectingNodeId.current) return;

			const targetIsPane = event.target.classList.contains("react-flow__pane");

			if (targetIsPane) {
				// we need to remove the wrapper bounds, in order to get the correct position
				const id = getId();
				const newNode = {
					id,
					position: screenToFlowPosition({
						x: event.clientX,
						y: event.clientY,
					}),
					data: { label: `Node ${id}` },
					style: {
						border: "1px solid #242424",
						borderRadius: "35px",
						cursor: "pointer",
						width: "50px",
						height: "50px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						fontSize: "10px",
					},

					origin: [0.5, 0.0],
				};

				setNodes((nds) => nds.concat(newNode));
				setEdges((eds) =>
					eds.concat({ id, source: connectingNodeId.current, target: id })
				);
			}
		},
		[screenToFlowPosition]
	);

	/***
	 * Create a new node
	 * @returns {void}
	 */
	const handleCreateNode = () => {
		const id = getId();
		const newNode = {
			id,
			data: { label: <SiCreatereactapp /> },
			position: { x: 100, y: 100 }, // Initial position
			type: "input", // Default type (adjust as needed)
			style: {
				border: "1px solid red",
				borderRadius: "35px",
				cursor: "pointer",
				width: "50px",
				height: "50px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				fontSize: "20px",
			},
		};
		setNodes([...nodes, newNode]); // Add new node to state
	};

	/***
	 * Update the node title when the input value changes
	 * @param {string} inputValue - The new input value
	 * @returns {void}
	 *
	 */
	const handleNodeClick = (event, node) => {
		event.preventDefault();
		if (node && node.id) {
			console.log("Selected node ID:", node.id);
			setSelectedNode(node);

			// const storedNodes = localStorage.getItem(localStorageKey);
			// if (storedNodes) {
			// 	try {
			// 		const parsedNodes = JSON.parse(storedNodes);
			// 		const storedNode = parsedNodes.find((n) => n.id === node.id);
			// 		if (storedNode) {
			// 			// Update the state with the stored node data
			// 			setNodes(parsedNodes);
			// 		}
			// 	} catch (error) {
			// 		console.error("Error parsing stored nodes:", error);
			// 	}
			// }
		}
	};

	/**
	 * Save the updated node title
	 * @param {string} newTitle - The new title to save
	 * @returns {void}
	 */
	const handleSaveNodeTitle = useCallback(() => {
		if (!selectedNode) return;

		const updatedNode = {
			...selectedNode,
			data: {
				...selectedNode.data,
				label: inputValue,
			},
		};

		setNodes((prevNodes) =>
			prevNodes.map((node) =>
				node.id === selectedNode.id ? updatedNode : node
			)
		);

		setSelectedNode(null);
		setInputValue("");
	}, [selectedNode, inputValue, setNodes]);

	/**
	 * Set the hovered node
	 * @param {string} node - The node to set as hovered
	 *
	 */
	useEffect(() => {
		setNodes((nds) =>
		  nds.map((node) => {
			if (hoveredNodeId === node.id) {
			  node.style = {
				...node.style,
				border: "2px solid #242424",
				cursor: "pointer",
				backgroundColor: "#d97979",
				color: "white",
				// position: "relative", // Ensure node container has relative position
			  };
			  // Create delete button and add it to node data
			  const deleteButton = (
				<div
				  style={{
					position: "absolute",
					top: "-10px", // Adjust top position as needed
					right: "-10px", // Adjust right position as needed
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: "1.5rem",
					height: "1.5rem",
					cursor: "pointer",
					backgroundColor: "#d97979",
					color: "white",
					borderRadius: "50%",
					zIndex: 10,
				  }}
				  onClick={() => {
					setNodes(nodes.filter((n) => n.id !== node.id));
				  }}
				>
				  X
				</div>
			  );
			  node.data = { ...node.data, deleteButton };
			} else {
			  node.style = {
				...node.style,
				border: "1px solid #242424",
				cursor: "pointer",
				backgroundColor: "#ffffff",
				color: "#000000",
			  };
			  // Remove delete button from node data
			  delete node.data.deleteButton;
			}
			return node;
		  })
		);
	  }, [hoveredNodeId, nodes, setNodes]);
	  

	/**
	 * Set the hovered node
	 * @param {string} node - The node to set as hovered
	 */
	const handleNodeMouseEnter = (event, node) => {
		event.preventDefault();
		// console.log("Node mouse enter:", node.id);

		setHoveredNodeId(node.id);
	};

	/**
	 * Clear the hovered node
	 * @returns {void}
	 */
	
	const handleNodeMouseLeave = () => {
		// console.log("Node mouse leave:", hoveredNodeId);

		setHoveredNodeId(null);
	};

	return (
		<div className='wrapper' ref={reactFlowWrapper}>
			<CreateNodeButton onClick={handleCreateNode} />
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onConnectStart={onConnectStart}
				onConnectEnd={onConnectEnd}
				onNodeClick={handleNodeClick}
				onNodeMouseEnter={handleNodeMouseEnter}
				onNodeMouseLeave={handleNodeMouseLeave}
				fitView
				fitViewOptions={{ padding: 2 }}
				nodeOrigin={[0.5, 0]}></ReactFlow>
			{selectedNode && (
				// Render popup if a node is selected
				<div className='popup'>
					<input
						type='text'
						value={inputValue || ""} // Add null check for selectedNode.data
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<button
						className='save-btn'
						onClick={() => handleSaveNodeTitle(selectedNode.data?.label)}>
						<CiSaveDown1 />
					</button>
				</div>
			)}
		</div>
	);
};

export default () => (
	<ReactFlowProvider>
		<Home />
	</ReactFlowProvider>
);
