'use client';

import { useState } from 'react';
import { X, ExternalLink, Users, MapPin, Calendar, DollarSign, Zap, AlertTriangle, Play, Video } from 'lucide-react';
import { CLASSIFICATION_CONFIG } from '@/lib/helpers';
import type { Competitor, Video as VideoType } from '@/lib/types';

function VideoSection({ videos }: { videos: VideoType[] }) {
    const [playingId, setPlayingId] = useState<number | null>(null);

    return (
        <div>
            <h3 className="text-sm font-medium text-sg-textDim mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-sg-accent" /> Videos & Media
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {videos.map((video, i) => {
                    const thumbUrl = video.thumbnail_id
                        ? `https://img.youtube.com/vi/${video.thumbnail_id}/mqdefault.jpg` : null;
                    const isPlaying = playingId === i;

                    if (isPlaying) {
                        return (
                            <div key={i} className="col-span-2 rounded-lg overflow-hidden border border-sg-border bg-black">
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <iframe className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${video.thumbnail_id || ''}?autoplay=1`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen title={video.title} />
                                </div>
                                <div className="px-3 py-2 flex items-center justify-between">
                                    <p className="text-xs text-sg-textMuted truncate">{video.title}</p>
                                    <button onClick={() => setPlayingId(null)} className="text-xs text-sg-textDim hover:text-sg-text ml-2 flex-shrink-0">Close</button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <button key={i} onClick={() => setPlayingId(i)}
                            className="group rounded-lg overflow-hidden border border-sg-border hover:border-sg-borderLight transition-all text-left">
                            <div className="relative w-full bg-sg-surfaceLight" style={{ paddingBottom: '56.25%' }}>
                                {thumbUrl ? (
                                    <img src={thumbUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-sg-surface"><Video className="w-8 h-8 text-sg-textDim" /></div>
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 rounded-full bg-sg-accent/90 flex items-center justify-center"><Play className="w-4 h-4 text-sg-bg ml-0.5" /></div>
                                </div>
                                <span className="absolute bottom-1.5 right-1.5 text-[10px] px-1.5 py-0.5 rounded bg-black/80 text-white font-mono">{video.duration}</span>
                            </div>
                            <div className="px-2.5 py-2">
                                <p className="text-xs text-sg-text leading-snug line-clamp-2 group-hover:text-sg-accent transition-colors">{video.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-sg-textDim">{video.source}</span>
                                    <span className="text-[10px] text-sg-textDim">·</span>
                                    <span className="text-[10px] text-sg-textDim">{video.date}</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

interface Props {
    competitor: Competitor;
    onClose: () => void;
}

export default function CompetitorDetail({ competitor, onClose }: Props) {
    if (!competitor) return null;
    const classification = CLASSIFICATION_CONFIG[competitor.classification] || CLASSIFICATION_CONFIG.indirect_competitor;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-sg-bg border-l border-sg-border overflow-y-auto animate-slide-in-right">
                <div className="sticky top-0 z-10 bg-sg-bg/95 backdrop-blur border-b border-sg-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-sg-accent/10 border border-sg-accent/20 flex items-center justify-center text-sg-accent font-bold text-sm">
                                {competitor.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg text-sg-text">{competitor.name}</h2>
                                <div className="flex items-center gap-2">
                                    <span className={classification.className}>{classification.label}</span>
                                    <a href={`https://${competitor.website}`} target="_blank" rel="noopener noreferrer"
                                        className="text-xs text-sg-accent flex items-center gap-1 hover:underline">
                                        {competitor.website} <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-sg-surface text-sg-textMuted hover:text-sg-text transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-6">
                    <p className="text-sm text-sg-textMuted leading-relaxed">{competitor.description}</p>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: DollarSign, label: 'Total Funding', value: competitor.funding_total, color: 'text-sg-green' },
                            { icon: Users, label: 'Employees', value: competitor.employees, color: 'text-sg-purple' },
                            { icon: Calendar, label: 'Founded', value: competitor.founded, color: 'text-sg-orange' },
                            { icon: MapPin, label: 'Headquarters', value: competitor.hq, color: 'text-sg-teal' },
                        ].map(({ icon: Icon, label, value, color }) => (
                            <div key={label} className="glass-panel p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                                    <span className="text-xs text-sg-textDim">{label}</span>
                                </div>
                                <p className="text-sm font-medium text-sg-text">{value}</p>
                            </div>
                        ))}
                    </div>

                    {competitor.pricing && (
                        <div>
                            <h3 className="text-sm font-medium text-sg-textDim mb-2 uppercase tracking-wider">Pricing</h3>
                            <p className="text-sm text-sg-text">{competitor.pricing}</p>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-medium text-sg-textDim mb-2 uppercase tracking-wider">Features</h3>
                        <div className="flex flex-wrap gap-2">
                            {competitor.features?.map((f, i) => (
                                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-sg-surfaceLight border border-sg-border text-sg-textMuted">{f}</span>
                            ))}
                        </div>
                    </div>

                    {competitor.technologies && competitor.technologies.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-sg-textDim mb-2 uppercase tracking-wider">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {competitor.technologies.map((t, i) => (
                                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-sg-orange/10 border border-sg-orange/20 text-sg-orange">{t}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-medium text-sg-textDim mb-2 uppercase tracking-wider flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-sg-green" /> Strengths
                        </h3>
                        <ul className="space-y-1.5">
                            {competitor.strengths?.map((s, i) => (
                                <li key={i} className="text-sm text-sg-textMuted flex items-start gap-2">
                                    <span className="text-sg-green mt-1.5 flex-shrink-0">•</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-sg-textDim mb-2 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-sg-red" /> Weaknesses
                        </h3>
                        <ul className="space-y-1.5">
                            {competitor.weaknesses?.map((w, i) => (
                                <li key={i} className="text-sm text-sg-textMuted flex items-start gap-2">
                                    <span className="text-sg-red mt-1.5 flex-shrink-0">•</span> {w}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {competitor.people && competitor.people.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-sg-textDim mb-2 uppercase tracking-wider">Key People</h3>
                            <div className="space-y-2">
                                {competitor.people.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-sg-surfaceLight border border-sg-border flex items-center justify-center text-xs font-medium text-sg-textMuted">
                                            {p.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm text-sg-text">{p.name}</p>
                                            <p className="text-xs text-sg-textDim">{p.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {competitor.videos && competitor.videos.length > 0 && (
                        <VideoSection videos={competitor.videos} />
                    )}

                    {competitor.funding_rounds && competitor.funding_rounds.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-sg-textDim mb-3 uppercase tracking-wider">Funding History</h3>
                            <div className="space-y-3">
                                {competitor.funding_rounds.map((round, i) => (
                                    <div key={i} className="relative pl-6 pb-3 border-l border-sg-border last:border-l-0 last:pb-0">
                                        <div className="absolute left-0 top-0 w-2.5 h-2.5 -translate-x-[5.5px] rounded-full bg-sg-accent border-2 border-sg-bg" />
                                        <div className="flex items-baseline justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-sg-text">{round.round}</p>
                                                <p className="text-xs text-sg-textDim">{round.date}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-sg-green">{round.amount}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {round.investors?.map((inv, j) => (
                                                <span key={j} className="text-xs text-sg-purple">{inv}{j < (round.investors?.length ?? 0) - 1 ? ',' : ''}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
