import {createSlice} from '@reduxjs/toolkit';

const nodeSlice = createSlice({
    name: 'node',
    initialState: {
        nodes: [{
            id: '1',
            data: { label: 'Hello' },
            position: { x: 0, y: 0 },
            type: 'input',
          },
          {
            id: '2',
            data: { label: 'World' },
            position: { x: 100, y: 100 },
          },
        ],
        edges:[
            { id: '1-2', source: '1', target: '2', label: 'to the', type: 'step' },

          ]
    },
    reducers: {
        createNode: (state, action) => {
            state.nodes.push({ ...action.payload });
          },
          
        createEdge: (state, action) => {
            state.edges.push(action.payload);
        },
        deleteNode: (state, action) => {
            state.nodes = state.nodes.filter((node) => node.id !== action.payload);
        },
        deleteEdge: (state, action) => {
            state.edges = state.edges.filter((edge) => edge.id !== action.payload);
        },
        updateNodeTitle: (state, action) => {
            const node = state.nodes.find((node) => node.id === action.payload.id);
        },
        updateNode: (state, action) => {
            const { id, ...updatedProperties } = action.payload; // Destructure payload
            const nodeIndex = state.nodes.findIndex((node) => node.id === id);
          
            if (nodeIndex !== -1) {
              state.nodes[nodeIndex] = { // Update existing node
                ...state.nodes[nodeIndex],
                ...updatedProperties,
              };
            }
          }
}})
export const {createNode, createEdge, deleteNode, deleteEdge, updateNodeTitle,updateNode} = nodeSlice.actions;
export default nodeSlice.reducer;