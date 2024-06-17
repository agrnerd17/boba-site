import React, { useRef, useEffect } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        const width = mount.clientWidth;
        const height = mount.clientHeight;

        // Make scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xADD8E6); // Light pink background

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mount.appendChild(renderer.domElement);

        // Generate shape (cylinder) and make boba cup
        const geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            transparent: true,
            opacity: 0.3
        });
        const cylinder = new THREE.Mesh(geometry, material);
        scene.add(cylinder);

        //create liquid (a smaller cylinder inside)

        const liquidShape = new THREE.CylinderGeometry(0.9, 0.9, 2.8, 32);
        const liquid_material = new THREE.MeshBasicMaterial({
            color: 0xffc0cb,
            transparent: true,
            opacity: 0.6
        });
        const liquid = new THREE.Mesh(liquidShape, liquid_material);
        liquid.position.y = -0.1; 
        scene.add(liquid); //add liquid to cup
        
        //boba pearls (small spheres in liquid cylinder)
        const bobaShape = new THREE.SphereGeometry(0.1, 32, 32);
        const boba_material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const boba_balls = [];
        for (let i = 0; i < 20; i++) {
            const boba = new THREE.Mesh(bobaShape, boba_material);
            boba.position.set(
                (Math.random() - 0.5) * 1.8,
                (Math.random() - 0.5) * 2.6 - 1.4 / 2, //places boba spheres in middle part of the liquid
                (Math.random() - 0.5) * 1.8
            );
            boba_balls.push(boba);
            liquid.add(boba); //adds pearls to scene
        }

        // Orbit controls, for dragging the shape around
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        // Animation, for liquid movement too
        const animate = () => {
            requestAnimationFrame(animate);
            //liquid movement
            liquid.position.y = Math.sin(Date.now() * 0.002) * 0.05 - 0.1;
            
            //boba pearls movement
            boba_balls.forEach(boba => {
                if (boba.position.y > 1.4) boba.position.y = 1.4;
                if (boba.position.y < -1.4) boba.position.y = -1.4;
            });

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Clean up on unmount
        return () => {
            mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeScene;
