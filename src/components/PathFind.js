import React, { useEffect, useState } from 'react';
import Node from './Node';
import Astar from '../aStarAlgorithm/aStar'
import "./PathFind.css";
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const cols = 40;
const rows = 10;


const NODE_START_ROW = Math.floor(Math.random() * 10);;
const NODE_START_COL = Math.floor(Math.random() * 40);;

const NODE_END_ROW = Math.floor(Math.random() * 10);;
const NODE_END_COL = Math.floor(Math.random() * 40);;



export default function PathFind() {

    const [Grid, setGrid] = useState([]);
    const [Path, setPath] = useState([]);
    const [VisitedNodes, setVisitedNodes] = useState([]);

    useEffect(() => {
        initiazeGrid();
    }, []);

    //ALERT 


    // SPOT constructor
    function Spot(i, j) {

        this.x = i;
        this.y = j;

        this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
        this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;

        // COST valriables
        this.g = 0;
        this.f = 0;
        this.h = 0;

        this.nbrs = [];
        this.isWall = false;

        if (Math.random(1) < 0.2) {
            this.isWall = true;
        }

        this.prev = undefined;
        this.addNbrs = function (grid) {
            let i = this.x;
            let j = this.y;

            if (i > 0)
                this.nbrs.push(grid[i - 1][j]);
            if (i < rows - 1)
                this.nbrs.push(grid[i + 1][j]);

            if (j > 0)
                this.nbrs.push(grid[i][j - 1]);
            if (j < cols - 1)
                this.nbrs.push(grid[i][j + 1]);

        }

    }

    // CREATING 2d GRID
    const initiazeGrid = () => {
        const grid = new Array(rows);

        for (let i = 0; i < cols; i++) {
            grid[i] = new Array(cols);
        }

        createSpot(grid);
        setGrid(grid);
        addNeighbor(grid);

        const startNode = grid[NODE_START_ROW][NODE_START_COL];
        const endNode = grid[NODE_END_ROW][NODE_END_COL];

        startNode.isWall = false;
        endNode.isWall = false; 

        let path = Astar(startNode, endNode);

        setPath(path.path);
        setVisitedNodes(path.visitedNodes);
    }


    // ADD NBRS 
    const addNeighbor = (grid) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j].addNbrs(grid);
            }
        }
    }

    // CREATING SPOTS
    const createSpot = (grid) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = new Spot(i, j);
            }
        }
    }


    // GRID with NODES
    const gridWithNodes = (

        
        <div>
            {Grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="rowWrapper">
                        {row.map((col, colIndex) => {
                            const { isStart, isEnd, isWall } = col;
                            return <Node key={colIndex} isStart={isStart} isEnd={isEnd} row={rowIndex} col={colIndex} isWall={isWall} />
                        })}
                    </div>
                )
            })}
        </div>
    )

    const animateShortestPath = (shortestPathNodes) => {

        for (let i = 0; i < shortestPathNodes.length; i++) {
            setTimeout(() => {
                const node = shortestPathNodes[i];
                document.getElementById(`node-${node.x}-${node.y}`).className = "node node-shortest-path";
            }, 10 * i)
        }
        
        if (shortestPathNodes.length == 0) {
             alert("NO PATH FOUND") ; 
        }
    }

    const visualizePath = () => {
        for (let i = 0; i <= VisitedNodes.length; i++) {
            if (i === VisitedNodes.length) {
                setTimeout(() => {
                    animateShortestPath(Path);
                }, 20 * i)
            }
            else {
                setTimeout(() => {
                    const node = VisitedNodes[i];
                    document.getElementById(`node-${node.x}-${node.y}`).className = "node node-visited";
                }, 10 * i)
            }
        }
    }


    return (
        <div className='page'>
            <Navbar />
            <div className="wrapper">
                <h1 style={{ paddingTop: "20px" }}>A* Path Finding Visualizer</h1>
                <div style={{ paddingRight: "30px" }}>
                    <p id="rcorners1">
                        A * algorithm is a searching algorithm that searches for the shortest path between the initial and the final state. It is used in various applications, such as maps.
                        In maps the A* algorithm is used to calculate the shortest distance between the source (initial state) and the destination (final state).
                </p>
                </div>
                <button onClick={visualizePath}>
                    Visualize Path
                </button>
            
                <div style={{ paddingBottom: "50px" }}>
                    {gridWithNodes}
                </div>
              
            </div>

            <Footer />
        </div>
    )
}
