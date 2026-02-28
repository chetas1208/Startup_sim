import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { NODE_COLORS, NODE_LABELS } from '../utils/helpers';

export default function KnowledgeGraph({ graphData, onNodeClick }) {
  const fgRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 560 });
  const containerRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: 560 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const data = useMemo(() => {
    if (!graphData) return { nodes: [], links: [] };
    return {
      nodes: graphData.nodes.map((n) => ({ ...n })),
      links: graphData.edges.map((e) => ({
        source: e.from,
        target: e.to,
        label: e.label,
      })),
    };
  }, [graphData]);

  const connectedNodes = useMemo(() => {
    if (!hoveredNode) return new Set();
    const connected = new Set([hoveredNode]);
    data.links.forEach((link) => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      if (sourceId === hoveredNode) connected.add(targetId);
      if (targetId === hoveredNode) connected.add(sourceId);
    });
    return connected;
  }, [hoveredNode, data.links]);

  const nodeCanvasObject = useCallback(
    (node, ctx, globalScale) => {
      const size = (node.size || 10) / 3;
      const isHovered = node.id === hoveredNode;
      const isConnected = connectedNodes.has(node.id);
      const dimmed = hoveredNode && !isConnected;
      const color = NODE_COLORS[node.type] || '#64748b';

      ctx.globalAlpha = dimmed ? 0.15 : 1;

      // Glow effect for hovered
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
        ctx.fillStyle = color + '30';
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = isHovered ? color : color + 'cc';
      ctx.fill();

      // Border
      ctx.strokeStyle = isHovered ? '#ffffff' : color;
      ctx.lineWidth = isHovered ? 1.5 : 0.5;
      ctx.stroke();

      // Label
      if (globalScale > 0.7 || isHovered || isConnected) {
        const label = node.label;
        const fontSize = Math.max(10 / globalScale, 3);
        ctx.font = `${isHovered ? 'bold ' : ''}${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = dimmed ? '#64748b' : '#e2e8f0';
        ctx.fillText(label, node.x, node.y + size + 2);
      }

      ctx.globalAlpha = 1;
    },
    [hoveredNode, connectedNodes]
  );

  const linkCanvasObject = useCallback(
    (link, ctx) => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const isConnected = hoveredNode && (connectedNodes.has(sourceId) && connectedNodes.has(targetId));
      const dimmed = hoveredNode && !isConnected;

      ctx.globalAlpha = dimmed ? 0.05 : 0.3;
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.strokeStyle = isConnected ? '#38bdf8' : '#334155';
      ctx.lineWidth = isConnected ? 1.2 : 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    [hoveredNode, connectedNodes]
  );

  return (
    <div className="space-y-4">
      {/* Graph Container */}
      <div
        ref={containerRef}
        className="relative rounded-xl border border-sg-border bg-sg-bg overflow-hidden"
        style={{ height: 560 }}
      >
        {data.nodes.length > 0 && (
          <ForceGraph2D
            ref={fgRef}
            graphData={data}
            width={dimensions.width}
            height={560}
            backgroundColor="#0a0e17"
            nodeCanvasObject={nodeCanvasObject}
            linkCanvasObject={linkCanvasObject}
            nodeRelSize={4}
            linkDirectionalParticles={0}
            d3AlphaDecay={0.03}
            d3VelocityDecay={0.3}
            cooldownTicks={100}
            onNodeHover={(node) => setHoveredNode(node?.id || null)}
            onNodeClick={(node) => onNodeClick?.(node)}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            enableNodeDrag={true}
          />
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1">
          <button
            onClick={() => fgRef.current?.zoom(fgRef.current.zoom() * 1.3, 300)}
            className="w-8 h-8 rounded bg-sg-surface/90 border border-sg-border text-sg-textMuted
                       hover:text-sg-text hover:border-sg-borderLight flex items-center justify-center text-sm"
          >
            +
          </button>
          <button
            onClick={() => fgRef.current?.zoom(fgRef.current.zoom() / 1.3, 300)}
            className="w-8 h-8 rounded bg-sg-surface/90 border border-sg-border text-sg-textMuted
                       hover:text-sg-text hover:border-sg-borderLight flex items-center justify-center text-sm"
          >
            −
          </button>
          <button
            onClick={() => fgRef.current?.zoomToFit(400, 40)}
            className="w-8 h-8 rounded bg-sg-surface/90 border border-sg-border text-sg-textMuted
                       hover:text-sg-text hover:border-sg-borderLight flex items-center justify-center"
            title="Fit to view"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center px-4">
        {Object.entries(NODE_LABELS).map(([type, label]) => (
          <div key={type} className="flex items-center gap-2 text-xs text-sg-textMuted">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: NODE_COLORS[type] }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
