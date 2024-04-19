import React, { useCallback, useState, useEffect, useRef } from "react";
import ReactFlow, {
	useNodesState,
	useEdgesState,
	Controls,
	Background,
	addEdge,
	ReactFlowProvider,
} from "reactflow";

import CreateNodeButton from "./components/CrateNodeButton";

const localStorageKey = "reactflow-nodes"; // Key for local storage
const initialNodes = [
    {
      id: '0',
      type: 'input',
      data: { label: 'Node' },
      position: { x: 0, y: 50 },
    },
  ];

let id = 1;
const getId = () => `${id++}`;
const Home = () => {
	const reactFlowWrapper = useRef(null);
	const connectingNodeId = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedNode, setSelectedNode] = useState(null);
	const [clickedNodeId, setClickedNodeId] = useState(null);

	const handleNodeClick = (event, node) => {
		event.preventDefault();
		if (node && node.id) {
			console.log("Selected node ID:", node.id);
			setSelectedNode(node);
			setClickedNodeId(node.id); // Set the ID of the clicked node
			const storedNodes = localStorage.getItem(localStorageKey);
			if (storedNodes) {
				try {
					const parsedNodes = JSON.parse(storedNodes);
					const storedNode = parsedNodes.find((n) => n.id === node.id);
					if (storedNode) {
						// Update the state with the stored node data
						setNodes(parsedNodes);
					}
				} catch (error) {
					console.error("Error parsing stored nodes:", error);
				}
			}
		}
	};

	const handleSaveNodeTitle = (newTitle) => {
		setSelectedNode(newTitle); // Clear selected node after saving
	};

	
	const onConnect = useCallback(
		(params) => {
			setEdges((eds) => addEdge({ ...params, type: "step" }, eds)); // Add edge with type 'step'
		},
		[setEdges]
	);
	const handleCreateNode = () => {
		const newNode = {
			id: Math.random().toString(36).substring(2, 7), // Generate unique ID
			data: { label: `Node ${nodes.length + 1}` },
			position: { x: 100, y: 100 }, // Initial position
			type: "input", // Default type (adjust as needed)
		};
		setNodes([...nodes, newNode]); // Add new node to state
	};

	// Load nodes from local storage on component mount
	useEffect(() => {
		const storedNodes = localStorage.getItem(localStorageKey);
		if (storedNodes) {
			try {
				const parsedNodes = JSON.parse(storedNodes);
				setNodes(parsedNodes);
			} catch (error) {
				console.error("Error parsing stored nodes:", error);
			}
		}
	}, []);

	// Save nodes to local storage on changes
	useEffect(() => {
		localStorage.setItem(localStorageKey, JSON.stringify(nodes));
	}, [nodes]);

	return (
		<div className='app'>
			<CreateNodeButton onClick={handleCreateNode} />
			<ReactFlowProvider>
				<ReactFlow
					nodes={nodes}
					onNodesChange={onNodesChange}
					edges={edges}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onNodeClick={handleNodeClick}
                    defaultMarkerColor="#000"
					fitView>
					<Background variant='' />
					<Controls />
				</ReactFlow>
			</ReactFlowProvider>
			{selectedNode && (
				// Render popup if a node is selected
				<div
					style={{
						position: "absolute",
						right: 10,
						top: 10,
						backgroundColor: "#fff",
						padding: 10,
					}}>
					<input
						type='text'
						value={selectedNode.data?.label || ""} // Add null check for selectedNode.data
						onChange={(e) => handleSaveNodeTitle(e.target.value)}
					/>
					<button onClick={() => handleSaveNodeTitle(selectedNode.data?.label)}>
						Save
					</button>
				</div>
			)}
		</div>
	);
};

export default Home;
