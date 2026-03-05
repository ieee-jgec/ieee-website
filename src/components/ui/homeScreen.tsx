"use client";

import React, { useContext, useEffect, useRef } from "react";
import { Bungee } from "next/font/google";
import clsx from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";
import { SlideDownAnimation, SlideUpAnimation } from "./sectionAnimation";
import NavbarContext from "@/context/navbarContext";
import NavBar from "./navBar";
import { Button } from "./button";
import { useRouter } from "next/navigation";

const bungeeFont = Bungee({
  weight: "400",
  subsets: ["latin"],
});

export default function IEEEInteractiveCanvas() {
  const { setIsShowHeaderNav } = useContext(NavbarContext)!;
  useEffect(() => {
    if (window.scrollY < 200) setIsShowHeaderNav(false);
    const handleNav = () => {
      const scrollY = window.scrollY;

      if (scrollY > 200) setIsShowHeaderNav(true);
      else setIsShowHeaderNav(false);
    };

    document.addEventListener("scroll", handleNav);
    return () => document.removeEventListener("scroll", handleNav);
  }, [setIsShowHeaderNav]);

  // canvas controlls
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });

  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasRef_inner = canvas;
    const ctxRef_inner = ctx;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Hexagon grid system
    class HexGrid {
      hexSize: number;
      hexagons: Array<{
        x: number;
        y: number;
        opacity: number;
        targetOpacity: number;
        active: boolean;
      }>;

      constructor() {
        this.hexSize = 50;
        this.hexagons = [];
        this.createGrid();
      }

      createGrid() {
        const rows =
          Math.ceil(canvasRef_inner.height / (this.hexSize * 1.5)) + 2;
        const cols =
          Math.ceil(canvasRef_inner.width / (this.hexSize * Math.sqrt(3))) + 2;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x =
              col * this.hexSize * Math.sqrt(3) +
              ((row % 2) * this.hexSize * Math.sqrt(3)) / 2;
            const y = row * this.hexSize * 1.5;
            this.hexagons.push({
              x,
              y,
              opacity: 0.05,
              targetOpacity: 0.05,
              active: false,
            });
          }
        }
      }

      update(mouseX: number, mouseY: number) {
        this.hexagons.forEach((hex) => {
          const dx = mouseX - hex.x;
          const dy = mouseY - hex.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            hex.targetOpacity = 0.4 * (1 - dist / 150);
            hex.active = true;
          } else {
            hex.targetOpacity = 0.05;
            hex.active = false;
          }

          hex.opacity += (hex.targetOpacity - hex.opacity) * 0.1;
        });
      }

      draw() {
        this.hexagons.forEach((hex) => {
          ctxRef_inner.strokeStyle = hex.active
            ? `rgba(59, 130, 246, ${hex.opacity})`
            : `rgba(148, 163, 184, ${hex.opacity})`;
          ctxRef_inner.lineWidth = hex.active ? 2 : 1;

          ctxRef_inner.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = hex.x + this.hexSize * Math.cos(angle);
            const hy = hex.y + this.hexSize * Math.sin(angle);
            if (i === 0) ctxRef_inner.moveTo(hx, hy);
            else ctxRef_inner.lineTo(hx, hy);
          }
          ctxRef_inner.closePath();
          ctxRef_inner.stroke();

          if (hex.active && hex.opacity > 0.2) {
            ctxRef_inner.fillStyle = `rgba(59, 130, 246, ${hex.opacity * 0.1})`;
            ctxRef_inner.fill();
          }
        });
      }
    }

    // Circuit board nodes
    class CircuitNode {
      x: number;
      y: number;
      size: number;
      connections: CircuitNode[];
      pulse: number;
      glowIntensity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = 4;
        this.connections = [];
        this.pulse = 0;
        this.glowIntensity = Math.random();
      }

      update() {
        this.pulse += 0.05;
        this.glowIntensity = Math.sin(this.pulse) * 0.5 + 0.5;
      }

      draw() {
        // Outer glow
        const gradient = ctxRef_inner.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 3,
        );
        gradient.addColorStop(
          0,
          `rgba(59, 130, 246, ${this.glowIntensity * 0.5})`,
        );
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
        ctxRef_inner.fillStyle = gradient;
        ctxRef_inner.beginPath();
        ctxRef_inner.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctxRef_inner.fill();

        // Core
        ctxRef_inner.fillStyle = "#3b82f6";
        ctxRef_inner.beginPath();
        ctxRef_inner.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctxRef_inner.fill();

        // Highlight
        ctxRef_inner.fillStyle = "rgba(147, 197, 253, 0.8)";
        ctxRef_inner.beginPath();
        ctxRef_inner.arc(
          this.x - 1,
          this.y - 1,
          this.size * 0.4,
          0,
          Math.PI * 2,
        );
        ctxRef_inner.fill();
      }
    }

    // Data packets flowing through circuit
    class DataPacket {
      start: CircuitNode;
      end: CircuitNode;
      progress: number;
      speed: number;
      size: number;

      constructor(start: CircuitNode, end: CircuitNode) {
        this.start = start;
        this.end = end;
        this.progress = 0;
        this.speed = 0.01 + Math.random() * 0.02;
        this.size = 3;
      }

      update() {
        this.progress += this.speed;
        return this.progress < 1;
      }

      draw() {
        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;

        const gradient = ctxRef_inner.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          this.size * 2,
        );
        gradient.addColorStop(0, "rgba(96, 165, 250, 1)");
        gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.6)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");

        ctxRef_inner.fillStyle = gradient;
        ctxRef_inner.beginPath();
        ctxRef_inner.arc(x, y, this.size * 2, 0, Math.PI * 2);
        ctxRef_inner.fill();
      }
    }

    // Energy wave on click
    class EnergyWave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      thickness: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 200;
        this.opacity = 1;
        this.thickness = 20;
      }

      update() {
        this.radius += 6;
        this.opacity = 1 - this.radius / this.maxRadius;
        return this.radius < this.maxRadius;
      }

      draw() {
        ctxRef_inner.strokeStyle = `rgba(59, 130, 246, ${this.opacity * 0.6})`;
        ctxRef_inner.lineWidth = this.thickness * this.opacity;
        ctxRef_inner.beginPath();
        ctxRef_inner.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctxRef_inner.stroke();

        // Inner bright ring
        ctxRef_inner.strokeStyle = `rgba(147, 197, 253, ${this.opacity})`;
        ctxRef_inner.lineWidth = 2;
        ctxRef_inner.beginPath();
        ctxRef_inner.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctxRef_inner.stroke();
      }
    }

    // Geometric shapes floating in background
    class GeometricShape {
      x: number;
      y: number;
      type: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvasRef_inner.width;
        this.y = Math.random() * canvasRef_inner.height;
        this.type = Math.floor(Math.random() * 3); // 0: triangle, 1: circle, 2: square
        this.size = Math.random() * 30 + 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.1 + 0.05;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Wrap around screen
        if (this.x < -this.size) this.x = canvasRef_inner.width + this.size;
        if (this.x > canvasRef_inner.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvasRef_inner.height + this.size;
        if (this.y > canvasRef_inner.height + this.size) this.y = -this.size;
      }

      draw() {
        ctxRef_inner.save();
        ctxRef_inner.translate(this.x, this.y);
        ctxRef_inner.rotate(this.rotation);

        ctxRef_inner.strokeStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctxRef_inner.lineWidth = 2;

        if (this.type === 0) {
          // Triangle
          ctxRef_inner.beginPath();
          ctxRef_inner.moveTo(0, -this.size / 2);
          ctxRef_inner.lineTo(this.size / 2, this.size / 2);
          ctxRef_inner.lineTo(-this.size / 2, this.size / 2);
          ctxRef_inner.closePath();
          ctxRef_inner.stroke();
        } else if (this.type === 1) {
          // Circle
          ctxRef_inner.beginPath();
          ctxRef_inner.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctxRef_inner.stroke();
        } else {
          // Square
          ctxRef_inner.strokeRect(
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size,
          );
        }

        ctxRef_inner.restore();
      }
    }

    // Collision particles - ambient particles floating everywhere
    class CollisionParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      opacity: number;
      color: number[];
      mass: number;
      collisionFlash: number;

      constructor(x?: number, y?: number) {
        this.x = x || Math.random() * canvasRef_inner.width;
        this.y = y || Math.random() * canvasRef_inner.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 3 + 2;
        this.life = Math.random() * 0.8 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.2;
        this.color = Math.random() > 0.5 ? [147, 197, 253] : [59, 130, 246]; // Light blue or blue
        this.mass = this.size;
        this.collisionFlash = 0;
      }

      update(
        particles: CollisionParticle[],
        collisionEffects: CollisionSpark[],
      ) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.001;
        this.collisionFlash *= 0.9; // Fade collision flash

        // Bounce off edges
        if (
          this.x - this.size < 0 ||
          this.x + this.size > canvasRef_inner.width
        ) {
          this.vx *= -0.9;
          this.x = Math.max(
            this.size,
            Math.min(canvasRef_inner.width - this.size, this.x),
          );
        }
        if (
          this.y - this.size < 0 ||
          this.y + this.size > canvasRef_inner.height
        ) {
          this.vy *= -0.9;
          this.y = Math.max(
            this.size,
            Math.min(canvasRef_inner.height - this.size, this.y),
          );
        }

        // Check collision with other particles
        particles.forEach((other: CollisionParticle) => {
          if (other !== this) {
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDist = this.size + other.size;

            if (distance < minDist) {
              // Create collision spark effect
              const impactX = this.x + dx * 0.5;
              const impactY = this.y + dy * 0.5;
              collisionEffects.push(new CollisionSpark(impactX, impactY));

              // Flash both particles
              this.collisionFlash = 1;
              other.collisionFlash = 1;

              // Collision detected - elastic collision physics
              const angle = Math.atan2(dy, dx);
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);

              // Rotate velocities
              const vx1 = this.vx * cos + this.vy * sin;
              const vy1 = this.vy * cos - this.vx * sin;
              const vx2 = other.vx * cos + other.vy * sin;
              const vy2 = other.vy * cos - other.vx * sin;

              // Collision reaction (conservation of momentum)
              const totalMass = this.mass + other.mass;
              const newVx1 =
                ((this.mass - other.mass) * vx1 + 2 * other.mass * vx2) /
                totalMass;
              const newVx2 =
                ((other.mass - this.mass) * vx2 + 2 * this.mass * vx1) /
                totalMass;

              // Rotate back
              this.vx = newVx1 * cos - vy1 * sin;
              this.vy = vy1 * cos + newVx1 * sin;
              other.vx = newVx2 * cos - vy2 * sin;
              other.vy = vy2 * cos + newVx2 * sin;

              // Separate particles to prevent sticking
              const overlap = minDist - distance;
              const separateX = (overlap / 2) * cos;
              const separateY = (overlap / 2) * sin;
              this.x -= separateX;
              this.y -= separateY;
              other.x += separateX;
              other.y += separateY;
            }
          }
        });

        // Slight friction
        this.vx *= 0.995;
        this.vy *= 0.995;

        return this.life > 0;
      }

      draw() {
        const fadeOpacity = this.opacity * (this.life / 1.3);
        const flashBoost = this.collisionFlash * 0.5;

        // Main particle with gradient
        const gradient = ctxRef_inner.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size,
        );
        gradient.addColorStop(
          0,
          `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${
            fadeOpacity + flashBoost
          })`,
        );
        gradient.addColorStop(
          0.5,
          `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${
            (fadeOpacity + flashBoost) * 0.6
          })`,
        );
        gradient.addColorStop(
          1,
          `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0)`,
        );

        ctxRef_inner.fillStyle = gradient;
        ctxRef_inner.beginPath();
        ctxRef_inner.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctxRef_inner.fill();

        // Outer glow (brighter when colliding)
        const glowSize =
          this.collisionFlash > 0 ? this.size * 4 : this.size * 2.5;
        ctxRef_inner.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${
          this.color[2]
        }, ${(fadeOpacity + flashBoost) * 0.2})`;
        ctxRef_inner.beginPath();
        ctxRef_inner.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctxRef_inner.fill();

        // Collision ring effect
        if (this.collisionFlash > 0.3) {
          ctxRef_inner.strokeStyle = `rgba(255, 255, 255, ${
            this.collisionFlash * 0.6
          })`;
          ctxRef_inner.lineWidth = 2;
          ctxRef_inner.beginPath();
          ctxRef_inner.arc(
            this.x,
            this.y,
            this.size * (2 - this.collisionFlash),
            0,
            Math.PI * 2,
          );
          ctxRef_inner.stroke();
        }
      }
    }

    // Collision spark effect
    class CollisionSpark {
      x: number;
      y: number;
      particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
      }>;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.particles = [];

        // Create small spark particles
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6;
          this.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            life: 1,
          });
        }
      }

      update() {
        this.particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.9;
          p.vy *= 0.9;
          p.life -= 0.05;
        });

        return this.particles[0].life > 0;
      }

      draw() {
        this.particles.forEach((p) => {
          if (p.life > 0) {
            const gradient = ctxRef_inner.createRadialGradient(
              p.x,
              p.y,
              0,
              p.x,
              p.y,
              3,
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${p.life * 0.8})`);
            gradient.addColorStop(0.5, `rgba(147, 197, 253, ${p.life * 0.5})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);

            ctxRef_inner.fillStyle = gradient;
            ctxRef_inner.beginPath();
            ctxRef_inner.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctxRef_inner.fill();
          }
        });

        // Center flash
        const centerLife = this.particles[0].life;
        if (centerLife > 0.5) {
          ctxRef_inner.fillStyle = `rgba(255, 255, 255, ${
            (centerLife - 0.5) * 2
          })`;
          ctxRef_inner.beginPath();
          ctxRef_inner.arc(this.x, this.y, 4, 0, Math.PI * 2);
          ctxRef_inner.fill();
        }
      }
    }

    const hexGrid = new HexGrid();
    const circuitNodes: CircuitNode[] = [];
    const dataPackets: DataPacket[] = [];
    const energyWaves: EnergyWave[] = [];
    const geometricShapes: GeometricShape[] = [];
    const collisionParticles: CollisionParticle[] = [];
    const collisionEffects: CollisionSpark[] = [];

    // Create IEEE-inspired network structure (resembles a neural network / technology tree)
    const rightStart = canvas.width * 0.65;
    const centerY = canvas.height / 2;

    // Layer 1: Input layer (sensors/data sources) - 4 nodes
    const layer1Y = [centerY - 180, centerY - 60, centerY + 60, centerY + 180];
    layer1Y.forEach((y) => {
      circuitNodes.push(new CircuitNode(rightStart, y));
    });

    // Layer 2: Processing layer - 6 nodes (hexagonal pattern)
    const layer2X = rightStart + 150;
    const layer2Y = [
      centerY - 150,
      centerY - 90,
      centerY - 30,
      centerY + 30,
      centerY + 90,
      centerY + 150,
    ];
    layer2Y.forEach((y) => {
      circuitNodes.push(new CircuitNode(layer2X, y));
    });

    // Layer 3: Integration layer - 4 nodes
    const layer3X = rightStart + 300;
    const layer3Y = [centerY - 120, centerY - 40, centerY + 40, centerY + 120];
    layer3Y.forEach((y) => {
      circuitNodes.push(new CircuitNode(layer3X, y));
    });

    // Layer 4: Output layer (applications) - 3 nodes
    const layer4X = rightStart + 450;
    const layer4Y = [centerY - 80, centerY, centerY + 80];
    layer4Y.forEach((y) => {
      circuitNodes.push(new CircuitNode(layer4X, y));
    });

    // Create a few geometric shapes
    for (let i = 0; i < 6; i++) {
      geometricShapes.push(new GeometricShape());
    }

    // Initialize ambient collision particles across the screen
    for (let i = 0; i < 40; i++) {
      collisionParticles.push(new CollisionParticle());
    }

    // Connect layers in a neural network pattern
    // Layer 1 to Layer 2 connections (input to processing)
    for (let i = 0; i < 4; i++) {
      for (let j = 4; j < 10; j++) {
        // Each input connects to 3-4 processing nodes
        if (Math.abs(i - (j - 4)) <= 2) {
          circuitNodes[i].connections.push(circuitNodes[j]);
        }
      }
    }

    // Layer 2 to Layer 3 connections (processing to integration)
    for (let i = 4; i < 10; i++) {
      for (let j = 10; j < 14; j++) {
        // Processing nodes connect to nearby integration nodes
        if (Math.abs(i - 4 - (j - 10) * 1.5) <= 2) {
          circuitNodes[i].connections.push(circuitNodes[j]);
        }
      }
    }

    // Layer 3 to Layer 4 connections (integration to output)
    for (let i = 10; i < 14; i++) {
      for (let j = 14; j < 17; j++) {
        // Integration nodes converge to output nodes
        if (Math.abs(i - 10 - (j - 14) * 1.3) <= 1.5) {
          circuitNodes[i].connections.push(circuitNodes[j]);
        }
      }
    }

    let frameCount = 0;

    const animate = () => {
      frameCount++;

      // Clear with slight fade
      ctxRef_inner.fillStyle = "rgba(241, 245, 249, 0.4)";
      ctxRef_inner.fillRect(
        0,
        0,
        canvasRef_inner.width,
        canvasRef_inner.height,
      );

      // Update and draw geometric shapes first (behind everything)
      geometricShapes.forEach((shape) => {
        shape.update();
        shape.draw();
      });

      // Update and draw collision particles (ambient effect)
      for (let i = collisionParticles.length - 1; i >= 0; i--) {
        if (
          !collisionParticles[i].update(collisionParticles, collisionEffects)
        ) {
          collisionParticles.splice(i, 1);
          // Replace with new particle to maintain count
          collisionParticles.push(new CollisionParticle());
        } else {
          collisionParticles[i].draw();
        }
      }

      // Update and draw collision spark effects
      for (let i = collisionEffects.length - 1; i >= 0; i--) {
        if (!collisionEffects[i].update()) {
          collisionEffects.splice(i, 1);
        } else {
          collisionEffects[i].draw();
        }
      }

      // Occasionally spawn new collision particles randomly
      // if (Math.random() < 0.03) {
      //     collisionParticles.push(new CollisionParticle());
      // }

      // Update and draw hex grid
      hexGrid.update(mouseRef.current.x, mouseRef.current.y);
      hexGrid.draw();

      // Draw circuit connections
      circuitNodes.forEach((node) => {
        node.connections.forEach((target) => {
          const gradient = ctxRef_inner.createLinearGradient(
            node.x,
            node.y,
            target.x,
            target.y,
          );
          gradient.addColorStop(0, "rgba(148, 163, 184, 0.3)");
          gradient.addColorStop(0.5, "rgba(100, 116, 139, 0.4)");
          gradient.addColorStop(1, "rgba(148, 163, 184, 0.3)");

          ctxRef_inner.strokeStyle = gradient;
          ctxRef_inner.lineWidth = 1.5;
          ctxRef_inner.beginPath();
          ctxRef_inner.moveTo(node.x, node.y);
          ctxRef_inner.lineTo(target.x, target.y);
          ctxRef_inner.stroke();
        });
      });

      // Update and draw nodes
      circuitNodes.forEach((node) => {
        node.update();
        node.draw();
      });

      // Spawn data packets - less frequent
      if (frameCount % 100 === 0 && circuitNodes.length > 0) {
        const randomNode =
          circuitNodes[Math.floor(Math.random() * circuitNodes.length)];
        if (randomNode.connections.length > 0) {
          const target =
            randomNode.connections[
              Math.floor(Math.random() * randomNode.connections.length)
            ];
          dataPackets.push(new DataPacket(randomNode, target));
        }
      }

      // Update and draw data packets
      for (let i = dataPackets.length - 1; i >= 0; i--) {
        if (!dataPackets[i].update()) {
          dataPackets.splice(i, 1);
        } else {
          dataPackets[i].draw();
        }
      }

      // Update and draw energy waves
      for (let i = energyWaves.length - 1; i >= 0; i--) {
        if (!energyWaves[i].update()) {
          energyWaves.splice(i, 1);
        } else {
          energyWaves[i].draw();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleClick = (e: PointerEvent) => {
      const rect = canvasRef_inner.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      energyWaves.push(new EnergyWave(x, y));

      // // Add collision particles burst at click location
      // for (let i = 0; i < 20; i++) {
      //     collisionParticles.push(new CollisionParticle(x, y));
      // }

      // Add new circuit node at click
      const newNode = new CircuitNode(x, y);
      circuitNodes.forEach((node) => {
        const dx = node.x - x;
        const dy = node.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && node.connections.length < 4) {
          newNode.connections.push(node);
          node.connections.push(newNode);
        }
      });
      circuitNodes.push(newNode);

      // // Create burst of data packets - reduced amount
      for (let i = 0; i < 3; i++) {
        if (newNode.connections.length > 0) {
          const target =
            newNode.connections[
              Math.floor(Math.random() * newNode.connections.length)
            ];
          dataPackets.push(new DataPacket(newNode, target));
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef_inner.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isMoving: true,
      };
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef, // The element you want to track
    offset: ["start end", "end start"], // when to start/end tracking
  });

  // Map scroll progress (0 → 1) to motion values
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]); // parallax effect
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-100">
      <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair" />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="h-full w-full flex flex-col items-center "
          ref={sectionRef}
        >
          <div className="mb-10 h-fit">
            <SlideDownAnimation>
              <NavBar className="w-screen !bg-transparent backdrop-blur-none !border-0 sm:px-10 py-5 pointer-events-auto" />
            </SlideDownAnimation>
          </div>
          <div className="w-full h-full flex justify-start items-start">
            <SlideUpAnimation className="h-full">
              <motion.div style={{ y, opacity }} className="h-full">
                <div className="h-[80%] grid grid-rows[1fr_auto] space-y-6 p-10 max-sm:px-3">
                  <div className="space-y-4">
                    <div className="inline-block">
                      <div className="relative">
                        <h1 className="text-8xl font-bold text-slate-800 tracking-tighter">
                          IEEE
                        </h1>
                        <div
                          className="absolute inset-0 text-8xl font-bold text-blue-500 tracking-tighter"
                          style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                          }}
                        >
                          IEEE
                        </div>
                      </div>
                      <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-2"></div>
                    </div>

                    <p className="text-xl text-slate-600 font-medium tracking-wide max-w-2xl">
                      Institute of Electrical and Electronics Engineers
                    </p>

                    <p
                      className={clsx(
                        "text-2xl text-slate-500",
                        bungeeFont.className,
                      )}
                    >
                      Student Branch{" "}
                      <span className="text-blue-500 text-4xl">JGEC</span>
                    </p>
                  </div>

                  <div className="self-end flex gap-4 pt-4 pointer-events-auto max-sm:flex-col">
                    <Button
                      className="group relative px-10 py-5 max-sm:p-5 bg-blue-600 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-blue-700 hover:shadow-lg justify-center"
                      onClick={() => router.push("/events")}
                    >
                      <span className="relative z-10">Explore Innovations</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </Button>

                    <Button
                      variant="outline"
                      className="px-10 py-5 max-sm:p-5 bg-white text-blue-600 font-semibold rounded-lg border-2 !border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg justify-center"
                      onClick={() => router.push("/notices")}
                    >
                      View Announcements
                    </Button>
                  </div>
                </div>
              </motion.div>
            </SlideUpAnimation>
          </div>
        </div>
      </div>
    </div>
  );
}
