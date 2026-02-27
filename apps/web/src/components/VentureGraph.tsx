'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { GraphData } from '@/lib/api'

// ForceGraph2D expects window/document, so must be client-side only
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
})

interface VentureGraphProps {
    data: GraphData
    height?: number
}

export default function VentureGraph({ data, height = 400 }: VentureGraphProps) {
    const gData = useMemo(() => {
        return {
            nodes: data.nodes.map(n => ({ ...n })),
            links: data.edges.map(e => ({ ...e }))
        }
    }, [data])

    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">
            <div className="absolute top-4 left-4 z-10">
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                    Market Intelligence Graph
                </div>
            </div>

            <div style={{ height }}>
                <ForceGraph2D
                    graphData={gData}
                    nodeLabel={(node: any) => `${node.label}: ${node.properties?.description || node.properties?.text || ''}`}
                    nodeColor={(node: any) => {
                        if (node.type === 'Idea') return '#6366f1' // indigo-500
                        if (node.type === 'Competitor') return '#f43f5e' // rose-500
                        if (node.type === 'Segment') return '#10b981' // emerald-500
                        return '#71717a' // zinc-500
                    }}
                    nodeRelSize={6}
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    linkCurvature={0.25}
                    linkColor={() => '#d4d4d8'}
                    backgroundColor="transparent"
                    width={800} // This should ideally be responsive
                    height={height}
                />
            </div>

            <div className="absolute bottom-4 right-4 flex gap-4 text-[10px] font-medium text-zinc-500">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Startup Idea
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Competitors
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Segments
                </div>
            </div>
        </div>
    )
}
