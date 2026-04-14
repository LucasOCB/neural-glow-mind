import { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  z: number;
  brightness: number;
  targetBrightness: number;
  size: number;
  pulseSpeed: number;
  pulsePhase: number;
  cluster: number;
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
}

export function NeuralSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const nodeCount = 280;
    const clusters = 6;

    for (let i = 0; i < nodeCount; i++) {
      const cluster = Math.floor(Math.random() * clusters);
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 0.7 + Math.random() * 0.3;
      const sphereRadius = Math.min(width, height) * 0.3;

      // Add cluster offset for brain-like shape
      const clusterOffsetX = (cluster % 3 - 1) * sphereRadius * 0.15;
      const clusterOffsetY = (Math.floor(cluster / 3) - 0.5) * sphereRadius * 0.12;

      nodes.push({
        x: Math.sin(phi) * Math.cos(theta) * r * sphereRadius + clusterOffsetX,
        y: Math.sin(phi) * Math.sin(theta) * r * sphereRadius * 0.85 + clusterOffsetY,
        z: Math.cos(phi) * r * sphereRadius,
        brightness: Math.random() * 0.5 + 0.1,
        targetBrightness: Math.random() * 0.5 + 0.1,
        size: Math.random() * 2 + 0.8,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        cluster,
      });
    }

    // Create connections between nearby nodes
    const connections: Connection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const threshold = nodes[i].cluster === nodes[j].cluster ? 120 : 70;
        if (dist < threshold) {
          connections.push({ from: i, to: j, opacity: Math.max(0, 1 - dist / threshold) });
        }
      }
    }

    nodesRef.current = nodes;
    connectionsRef.current = connections;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      initNodes(canvas.offsetWidth, canvas.offsetHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const draw = (time: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const rotY = time * 0.0002 + mouseRef.current.x * 0.5;
      const rotX = mouseRef.current.y * 0.3;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const nodes = nodesRef.current;
      const connections = connectionsRef.current;

      // Random brightness changes
      if (Math.random() < 0.03) {
        const idx = Math.floor(Math.random() * nodes.length);
        nodes[idx].targetBrightness = Math.random() < 0.3 ? 0.8 + Math.random() * 0.2 : Math.random() * 0.4 + 0.1;
      }

      // Project nodes
      const projected = nodes.map((node, i) => {
        node.brightness += (node.targetBrightness - node.brightness) * 0.02;
        const pulse = Math.sin(time * node.pulseSpeed + node.pulsePhase) * 0.15 + 0.85;

        let x = node.x * cosY - node.z * sinY;
        let z = node.x * sinY + node.z * cosY;
        let y = node.y * cosX - z * sinX;
        z = node.y * sinX + z * cosX;

        const scale = 800 / (800 + z);
        return {
          x: cx + x * scale,
          y: cy + y * scale,
          z,
          scale,
          brightness: node.brightness * pulse,
          size: node.size * scale,
          index: i,
        };
      });

      projected.sort((a, b) => a.z - b.z);

      // Draw connections
      for (const conn of connections) {
        const a = projected.find((p) => p.index === conn.from)!;
        const b = projected.find((p) => p.index === conn.to)!;
        const avgBrightness = (a.brightness + b.brightness) * 0.5;
        const depthFade = Math.min(a.scale, b.scale);
        const alpha = conn.opacity * avgBrightness * depthFade * 0.3;

        if (alpha < 0.01) continue;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(140, 130, 255, ${alpha})`;
        ctx.lineWidth = 0.5 * depthFade;
        ctx.stroke();
      }

      // Draw nodes
      for (const p of projected) {
        const alpha = p.brightness * p.scale;
        const r = p.size;

        // Outer glow
        if (p.brightness > 0.5) {
          const glowR = r * 6;
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          glow.addColorStop(0, `rgba(160, 140, 255, ${alpha * 0.2})`);
          glow.addColorStop(0.5, `rgba(100, 140, 255, ${alpha * 0.05})`);
          glow.addColorStop(1, "rgba(100, 140, 255, 0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Node core
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        const bright = p.brightness > 0.6;
        grad.addColorStop(0, bright
          ? `rgba(230, 220, 255, ${alpha})`
          : `rgba(160, 150, 220, ${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(120, 100, 200, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Ambient particles
      for (let i = 0; i < 15; i++) {
        const px = cx + Math.sin(time * 0.0003 + i * 1.7) * w * 0.45;
        const py = cy + Math.cos(time * 0.0004 + i * 2.3) * h * 0.4;
        const pa = Math.sin(time * 0.001 + i) * 0.15 + 0.15;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 160, 255, ${pa})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ cursor: "crosshair" }}
    />
  );
}
