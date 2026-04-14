import { useEffect, useRef, useCallback, useState } from "react";

// Knowledge content for each node
const knowledgeData = [
  { name: "Quantum Computing", category: "Física", description: "Computação baseada em princípios da mecânica quântica, utilizando qubits para processamento paralelo massivo.", tags: ["qubits", "superposição", "emaranhamento"] },
  { name: "Redes Neurais", category: "IA", description: "Modelos computacionais inspirados no cérebro humano, compostos por camadas de neurônios artificiais interconectados.", tags: ["deep learning", "perceptron", "backpropagation"] },
  { name: "Teoria dos Grafos", category: "Matemática", description: "Estudo de estruturas formadas por vértices e arestas, fundamental para redes e otimização.", tags: ["grafos", "árvores", "caminhos"] },
  { name: "Ciência Cognitiva", category: "Neurociência", description: "Estudo interdisciplinar da mente e seus processos, incluindo percepção, memória e linguagem.", tags: ["cognição", "memória", "atenção"] },
  { name: "Machine Learning", category: "IA", description: "Algoritmos que aprendem padrões a partir de dados, melhorando seu desempenho sem programação explícita.", tags: ["supervisionado", "reforço", "clustering"] },
  { name: "Criptografia", category: "Segurança", description: "Técnicas para comunicação segura na presença de adversários, protegendo dados e privacidade.", tags: ["RSA", "hash", "chaves"] },
  { name: "Processamento de Linguagem", category: "IA", description: "Campo da IA focado na interação entre computadores e linguagem humana natural.", tags: ["NLP", "tokenização", "semântica"] },
  { name: "Computação Distribuída", category: "Sistemas", description: "Modelo onde componentes em rede se coordenam para alcançar um objetivo comum.", tags: ["consenso", "tolerância a falhas", "escalabilidade"] },
  { name: "Genética Computacional", category: "Biologia", description: "Uso de algoritmos para analisar sequências genéticas e entender a estrutura do DNA.", tags: ["genoma", "sequenciamento", "mutação"] },
  { name: "Realidade Virtual", category: "Interfaces", description: "Tecnologia que cria ambientes simulados imersivos através de estímulos sensoriais.", tags: ["VR", "imersão", "haptics"] },
  { name: "Robótica", category: "Engenharia", description: "Design e construção de robôs que interagem com o mundo físico de forma autônoma.", tags: ["atuadores", "sensores", "controle"] },
  { name: "Blockchain", category: "Sistemas", description: "Tecnologia de registro distribuído que garante transparência e imutabilidade de transações.", tags: ["descentralização", "consenso", "smart contracts"] },
  { name: "Visão Computacional", category: "IA", description: "Permite que computadores interpretem e entendam informações visuais do mundo real.", tags: ["detecção", "reconhecimento", "segmentação"] },
  { name: "Astrofísica", category: "Física", description: "Estudo da física do universo, incluindo estrelas, galáxias e a estrutura do cosmos.", tags: ["cosmologia", "relatividade", "espectroscopia"] },
  { name: "Filosofia da Mente", category: "Filosofia", description: "Investigação sobre a natureza da consciência, pensamento e relação mente-corpo.", tags: ["consciência", "qualia", "intencionalidade"] },
  { name: "Teoria da Informação", category: "Matemática", description: "Estudo da quantificação, armazenamento e comunicação de informação digital.", tags: ["entropia", "compressão", "canal"] },
  { name: "Neuroplasticidade", category: "Neurociência", description: "Capacidade do cérebro de reorganizar suas conexões sinápticas ao longo da vida.", tags: ["sinapses", "adaptação", "aprendizado"] },
  { name: "Ética da IA", category: "Filosofia", description: "Questões morais e sociais relacionadas ao desenvolvimento e uso de inteligência artificial.", tags: ["viés", "transparência", "responsabilidade"] },
  { name: "Nanotecnologia", category: "Engenharia", description: "Manipulação de matéria em escala atômica e molecular para criar novos materiais e dispositivos.", tags: ["nanomateriais", "nanorobôs", "escala"] },
  { name: "Psicologia Evolutiva", category: "Psicologia", description: "Estudo de como processos evolutivos moldaram o comportamento e a cognição humana.", tags: ["adaptação", "seleção", "instinto"] },
];

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
  dataIndex: number;
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
}

interface ProjectedNode {
  x: number;
  y: number;
  z: number;
  scale: number;
  brightness: number;
  size: number;
  index: number;
}

export interface SelectedNodeInfo {
  name: string;
  category: string;
  description: string;
  tags: string[];
  connectedNames: string[];
  screenX: number;
  screenY: number;
}

interface NeuralSphereProps {
  onNodeSelect?: (info: SelectedNodeInfo | null) => void;
  selectedNodeIndex?: number | null;
}

export function NeuralSphere({ onNodeSelect, selectedNodeIndex }: NeuralSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const projectedRef = useRef<ProjectedNode[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const selectedRef = useRef<number | null>(null);

  useEffect(() => {
    selectedRef.current = selectedNodeIndex ?? null;
  }, [selectedNodeIndex]);

  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const nodeCount = knowledgeData.length;
    const extraNodes = 260;
    const clusters = 6;
    const sphereRadius = Math.min(width, height) * 0.3;

    // Knowledge nodes
    for (let i = 0; i < nodeCount; i++) {
      const cluster = i % clusters;
      const phi = Math.acos(2 * (i / nodeCount) - 1 + (Math.random() * 0.3 - 0.15));
      const theta = (i / nodeCount) * Math.PI * 2 * 3 + Math.random() * 0.5;
      const r = 0.75 + Math.random() * 0.25;

      const clusterOffsetX = (cluster % 3 - 1) * sphereRadius * 0.12;
      const clusterOffsetY = (Math.floor(cluster / 3) - 0.5) * sphereRadius * 0.1;

      nodes.push({
        x: Math.sin(phi) * Math.cos(theta) * r * sphereRadius + clusterOffsetX,
        y: Math.sin(phi) * Math.sin(theta) * r * sphereRadius * 0.85 + clusterOffsetY,
        z: Math.cos(phi) * r * sphereRadius,
        brightness: 0.5 + Math.random() * 0.3,
        targetBrightness: 0.5 + Math.random() * 0.3,
        size: 2.5 + Math.random() * 1.5,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        cluster,
        dataIndex: i,
      });
    }

    // Extra ambient nodes (no data)
    for (let i = 0; i < extraNodes; i++) {
      const cluster = Math.floor(Math.random() * clusters);
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 0.7 + Math.random() * 0.3;

      const clusterOffsetX = (cluster % 3 - 1) * sphereRadius * 0.15;
      const clusterOffsetY = (Math.floor(cluster / 3) - 0.5) * sphereRadius * 0.12;

      nodes.push({
        x: Math.sin(phi) * Math.cos(theta) * r * sphereRadius + clusterOffsetX,
        y: Math.sin(phi) * Math.sin(theta) * r * sphereRadius * 0.85 + clusterOffsetY,
        z: Math.cos(phi) * r * sphereRadius,
        brightness: Math.random() * 0.3 + 0.1,
        targetBrightness: Math.random() * 0.3 + 0.1,
        size: Math.random() * 1.5 + 0.5,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        cluster,
        dataIndex: -1,
      });
    }

    // Connections
    const connections: Connection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const threshold = nodes[i].cluster === nodes[j].cluster ? 120 : 65;
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

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const projected = projectedRef.current;

      // Find closest knowledge node within hit radius
      let closest: { dist: number; index: number } | null = null;
      for (const p of projected) {
        const node = nodesRef.current[p.index];
        if (node.dataIndex < 0) continue;
        const dx = clickX - p.x;
        const dy = clickY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = Math.max(p.size * 4, 14);
        if (dist < hitRadius && (!closest || dist < closest.dist)) {
          closest = { dist, index: p.index };
        }
      }

      if (closest) {
        const node = nodesRef.current[closest.index];
        const proj = projected.find((p) => p.index === closest!.index)!;
        const data = knowledgeData[node.dataIndex];

        // Find connected knowledge node names
        const connectedIndices = new Set<number>();
        for (const conn of connectionsRef.current) {
          if (conn.from === closest.index) connectedIndices.add(conn.to);
          if (conn.to === closest.index) connectedIndices.add(conn.from);
        }
        const connectedNames = Array.from(connectedIndices)
          .map((i) => nodesRef.current[i].dataIndex)
          .filter((di) => di >= 0)
          .map((di) => knowledgeData[di].name);

        selectedRef.current = closest.index;
        onNodeSelect?.({
          ...data,
          connectedNames,
          screenX: proj.x,
          screenY: proj.y,
        });
      } else {
        selectedRef.current = null;
        onNodeSelect?.(null);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    let animId: number;
    const draw = (time: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const rotY = time * 0.00015 + mouseRef.current.x * 0.5;
      const rotX = mouseRef.current.y * 0.3;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      const selected = selectedRef.current;

      // Random brightness changes
      if (Math.random() < 0.03) {
        const idx = Math.floor(Math.random() * nodes.length);
        nodes[idx].targetBrightness = Math.random() < 0.3 ? 0.8 + Math.random() * 0.2 : Math.random() * 0.4 + 0.1;
      }

      // Build connected set for selected node
      const connectedSet = new Set<number>();
      if (selected !== null) {
        connectedSet.add(selected);
        for (const conn of connections) {
          if (conn.from === selected) connectedSet.add(conn.to);
          if (conn.to === selected) connectedSet.add(conn.from);
        }
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
      projectedRef.current = projected;

      // Build index lookup map
      const projMap = new Map<number, ProjectedNode>();
      for (const p of projected) projMap.set(p.index, p);

      // Draw connections
      for (const conn of connections) {
        const a = projMap.get(conn.from);
        const b = projMap.get(conn.to);
        if (!a || !b) continue;
        const isHighlighted = selected !== null && (
          (conn.from === selected || conn.to === selected) &&
          connectedSet.has(conn.from) && connectedSet.has(conn.to)
        );

        const avgBrightness = (a.brightness + b.brightness) * 0.5;
        const depthFade = Math.min(a.scale, b.scale);

        if (isHighlighted) {
          // Glowing highlighted connection
          const glowAlpha = conn.opacity * 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(180, 160, 255, ${glowAlpha})`;
          ctx.lineWidth = 2.5 * depthFade;
          ctx.shadowColor = "rgba(160, 140, 255, 0.6)";
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Inner bright line
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(220, 210, 255, ${glowAlpha * 0.6})`;
          ctx.lineWidth = 1 * depthFade;
          ctx.stroke();
        } else {
          const dimFactor = selected !== null ? 0.15 : 1;
          const alpha = conn.opacity * avgBrightness * depthFade * 0.3 * dimFactor;
          if (alpha < 0.01) continue;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(140, 130, 255, ${alpha})`;
          ctx.lineWidth = 0.5 * depthFade;
          ctx.stroke();
        }
      }

      // Draw nodes
      for (const p of projected) {
        const node = nodes[p.index];
        const isSelected = p.index === selected;
        const isConnected = connectedSet.has(p.index);
        const isKnowledge = node.dataIndex >= 0;
        const dimmed = selected !== null && !isConnected;

        const alpha = dimmed ? p.brightness * p.scale * 0.15 : p.brightness * p.scale;
        const r = isSelected ? p.size * 1.8 : isConnected && selected !== null ? p.size * 1.3 : p.size;

        // Outer glow for highlighted/active nodes
        if (isSelected) {
          const glowR = r * 10;
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          glow.addColorStop(0, "rgba(180, 160, 255, 0.35)");
          glow.addColorStop(0.3, "rgba(140, 130, 255, 0.15)");
          glow.addColorStop(1, "rgba(100, 100, 255, 0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        } else if (isConnected && selected !== null) {
          const glowR = r * 6;
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          glow.addColorStop(0, "rgba(160, 150, 255, 0.25)");
          glow.addColorStop(0.5, "rgba(130, 120, 255, 0.08)");
          glow.addColorStop(1, "rgba(100, 100, 255, 0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        } else if (p.brightness > 0.5 && !dimmed) {
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
        if (isSelected) {
          grad.addColorStop(0, "rgba(255, 250, 255, 0.95)");
          grad.addColorStop(0.6, "rgba(200, 180, 255, 0.6)");
          grad.addColorStop(1, "rgba(160, 140, 255, 0)");
        } else if (isConnected && selected !== null) {
          grad.addColorStop(0, `rgba(220, 210, 255, ${alpha})`);
          grad.addColorStop(0.7, `rgba(160, 150, 255, ${alpha * 0.5})`);
          grad.addColorStop(1, "rgba(130, 120, 255, 0)");
        } else {
          const bright = p.brightness > 0.6 && !dimmed;
          grad.addColorStop(0, bright
            ? `rgba(230, 220, 255, ${alpha})`
            : `rgba(160, 150, 220, ${alpha * 0.8})`);
          grad.addColorStop(1, "rgba(120, 100, 200, 0)");
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Label for knowledge nodes (only when close/large enough or selected/connected)
        if (isKnowledge && !dimmed && (isSelected || isConnected || p.scale > 0.85)) {
          const data = knowledgeData[node.dataIndex];
          const fontSize = isSelected ? 12 : isConnected && selected !== null ? 10 : 9;
          const labelAlpha = isSelected ? 0.95 : isConnected && selected !== null ? 0.8 : Math.min(alpha * 0.8, 0.5);
          ctx.font = `${fontSize}px "Space Grotesk", system-ui, sans-serif`;
          ctx.fillStyle = `rgba(220, 215, 255, ${labelAlpha})`;
          ctx.textAlign = "center";
          ctx.fillText(data.name, p.x, p.y - r - 6);
        }
      }

      // Ambient particles
      for (let i = 0; i < 12; i++) {
        const px = cx + Math.sin(time * 0.0003 + i * 1.7) * w * 0.45;
        const py = cy + Math.cos(time * 0.0004 + i * 2.3) * h * 0.4;
        const pa = Math.sin(time * 0.001 + i) * 0.12 + 0.12;
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
      canvas.removeEventListener("click", handleClick);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ cursor: "pointer" }}
    />
  );
}
