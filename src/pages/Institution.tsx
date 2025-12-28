import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function Institution() {
    // const { t } = useLanguage();
    const [reps, setReps] = useState<any[]>([]);

    useEffect(() => {
        fetchRepresentatives();
    }, []);

    const fetchRepresentatives = async () => {
        try {
            const { data } = await supabase
                .from('representatives')
                .select('*')
                .eq('year', '2025') // Default to current year
                .order('display_order', { ascending: true });

            if (data) setReps(data);
        } catch (error) {
            console.error('Error fetching representatives:', error);
        }
    };

    // Filter helpers
    const president = reps.find(r => r.role === 'presidente');
    const honorCourt = reps.filter(r => ['fallera_mayor', 'fallera_mayor_infantil', 'presidente_infantil'].includes(r.role));
    // Sort Honor Court: FM, FMI, PI
    const honorOrder = ['fallera_mayor', 'fallera_mayor_infantil', 'presidente_infantil'];
    honorCourt.sort((a, b) => honorOrder.indexOf(a.role) - honorOrder.indexOf(b.role));

    const boardMembers = reps.filter(r => !['presidente', 'fallera_mayor', 'fallera_mayor_infantil', 'presidente_infantil'].includes(r.role));

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'fallera_mayor': return 'Fallera Mayor';
            case 'fallera_mayor_infantil': return 'F.M. Infantil';
            case 'presidente': return 'Presidente';
            case 'presidente_infantil': return 'Pres. Infantil';
            case 'vicepresidente': return 'Vicepresidencia';
            case 'secretario': return 'Secretaría';
            case 'tesorero': return 'Tesorería';
            case 'delegado': return 'Delegación';
            case 'vocal': return 'Vocalía';
            default: return role;
        }
    };

    return (
        <div className="relative flex flex-col min-h-screen w-full">
            <div className="relative w-full">
                <div
                    className="w-full h-[450px] bg-cover bg-center bg-no-repeat relative"
                    data-alt="Traditional fallas silk fabric texture dark background with golden embroidery"
                    style={{ backgroundImage: 'linear-gradient(rgba(17, 23, 20, 0.75) 0%, rgba(17, 23, 20, 1) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAIw0X3bSBlvyT5oqqk7IOjUY6_TeQQv2v8-wuptrQRW7B7DJ5vfE1cxknYG2tw_R4Cn8wRdjGXr8m69wJY-1Q8sKbXSkDeuZP47JUkpoQhsLyole7WQtGUKF-OBWbX745Sb84vnvvWdvahtCpMci8Kt0FOTmpEYmJlSY59RRSYLLPJefCV7SShhZ8m6qpBpy6F2VuGs6pA_c7Z1sAq-XExICsPb67JPT1-Q4OG5a83nBf-xEhn3eG1DkpCp8SsBZulS928vrkpc-w")' }}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-[960px] mx-auto mt-8">
                        <div className="w-24 h-24 mb-6 drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-300">
                            <img alt="Escudo Falla Turia" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsDbZ2eK3c-E8gFYd7M5q1yH20l15NRMZTfeRmUi308HRZmpDpUer4CD0OwjNuDt97xfjoM2zZoCgme9CSkV5XmOZGfHGsGxMmQw83bss0bDrdQQQRHGa5ZuVrHRgykO5kNA8mAKiHGYtY2trxS4C8uZtw6Ffu05LgBB49G2i-CS6G0kvH_UFj9dENVekbdMIGnn40u8MTWsyGRFg_wgtUbzTENgixIBoU9PGX0u2Lr2w3b9ozDpzzuSXC8xhj1nwzeME4fb1UcK0" />
                        </div>
                        <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em] mb-4 drop-shadow-sm">
                            Institución
                        </h1>
                        <p className="text-gray-200 text-base md:text-lg font-normal max-w-2xl leading-relaxed">
                            Fuego, tradición y pólvora. Conoce a las personas que mantienen viva nuestra historia y proyectan nuestro futuro.
                        </p>
                    </div>
                </div>
            </div>

            <main className="layout-container flex flex-col flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-10 py-10 gap-16 -mt-20 z-10 relative">
                <div className="flex justify-center w-full sticky top-[80px] z-40 py-4">
                    <div className="bg-white dark:bg-surface-dark p-1.5 rounded-full inline-flex shadow-lg border border-gray-100 dark:border-border-dark">
                        <button className="px-8 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">groups</span>
                            Junta Local
                        </button>
                        <button className="px-8 py-3 rounded-full text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5 font-bold text-sm transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">military_tech</span>
                            Cuadro de Honor
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-12 animate-fade-in">
                    {/* President Section */}
                    {president && (
                        <section className="bg-white dark:bg-surface-dark rounded-2xl p-8 md:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-border-dark flex flex-col md:flex-row gap-10 items-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <div className="shrink-0 relative z-10">
                                <div className="w-48 h-48 rounded-full border-4 border-primary p-1.5 shadow-lg">
                                    <div
                                        className="w-full h-full rounded-full bg-cover bg-center"
                                        style={{ backgroundImage: `url("${president.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWt2KTf5t7BPmb8foIoDJiRcWx4Bagn0p86fQBsdSfCanuHPqjRMHR5DrvpJohG3Ioe2xeEnKWlYQcTw9Kol0IXHx6-2-bJOpErflJX_yCMX5wiWRtPllYXc-LFgbcWL1dbi1cz_DhX-tdP5xIvBJlMe7NeXUfP1ljhYIbVvhnBBar49gNgLUwq7m2VNNMWwTbDd3c3t0LyWEbtWWiRBZ9rrQPSwGCRXhDWFi7SxB_kFvWgYdMSX5cnMIGmss2bOiO0rWQ5WrhToM'}")` }}
                                    ></div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-white dark:border-surface-dark">
                                    <span className="material-symbols-outlined text-lg font-bold">format_quote</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 text-center md:text-left z-10 flex-1">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-[#111714] dark:text-white tracking-tight">Saluda del Presidente</h2>
                                    <p className="text-primary font-bold text-lg">{president.name}</p>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute -top-4 -left-6 text-4xl text-gray-200 dark:text-gray-700 select-none">format_quote</span>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-medium relative z-10 pl-2">
                                        {president.description || "Bienvenidos a un nuevo ejercicio fallero. Es un honor presidir esta comisión un año más, trabajando codo a codo para que la pólvora, la música y la tradición sigan siendo el corazón de nuestro barrio."}
                                    </p>
                                </div>
                                <div className="flex justify-center md:justify-start gap-4 pt-2">
                                    <a className="px-6 py-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-sm font-bold text-[#111714] dark:text-white hover:bg-primary hover:text-white flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1" href="#">
                                        <span className="material-symbols-outlined text-[18px]">mail</span> Contactar con Presidencia
                                    </a>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Board Section */}
                    <section>
                        <div className="flex items-center justify-between mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
                            <h3 className="text-2xl font-bold text-[#111714] dark:text-white flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-primary rounded-full"></span>
                                Organigrama Actual
                            </h3>
                            {/* <button className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
                                Ver listado completo <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </button> */}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {boardMembers.length > 0 ? boardMembers.map((member) => (
                                <div key={member.id} className="group bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-border-dark hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-6">
                                        <div
                                            className="w-20 h-20 rounded-full bg-cover bg-center bg-gray-200 shadow-md group-hover:ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-surface-dark transition-all"
                                            style={{ backgroundImage: `url("${member.image_url || 'https://via.placeholder.com/150'}")` }}
                                        ></div>
                                        <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">{getRoleLabel(member.role)}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-[#111714] dark:text-white mb-1">{member.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">{member.description || getRoleLabel(member.role)}</p>
                                    <div className="flex gap-3 mt-auto border-t border-gray-50 dark:border-gray-800 pt-4">
                                        <button className="w-9 h-9 rounded-full bg-gray-50 dark:bg-background-dark flex items-center justify-center text-gray-500 hover:text-white hover:bg-primary transition-all duration-300">
                                            <span className="material-symbols-outlined text-[18px]">call</span>
                                        </button>
                                        <button className="w-9 h-9 rounded-full bg-gray-50 dark:bg-background-dark flex items-center justify-center text-gray-500 hover:text-white hover:bg-primary transition-all duration-300">
                                            <span className="material-symbols-outlined text-[18px]">mail</span>
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500 col-span-3 text-center">No hay miembros del organigrama para mostrar aún.</p>
                            )}
                        </div>
                    </section>

                    {/* Honor Court Section */}
                    {honorCourt.length > 0 && (
                        <section className="mt-8 border-t border-dashed border-gray-300 dark:border-gray-700 pt-16">
                            <div className="flex flex-col gap-6 text-center mb-16">
                                <span className="text-primary font-bold tracking-widest uppercase text-sm">Representación 2025</span>
                                <h3 className="text-4xl font-black text-[#111714] dark:text-white tracking-tight">Cuadro de Honor</h3>
                                <p className="text-gray-500 text-lg max-w-2xl mx-auto">Nuestros máximos representantes para este ejercicio fallero.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-5xl mx-auto items-end pb-8">
                                {honorCourt.map((rep) => {
                                    // Special styling for Fallera Mayor (center)
                                    const isFM = rep.role === 'fallera_mayor';
                                    const orderClass = isFM ? 'order-1 md:order-2 mb-8 md:mb-0' : (rep.role === 'fallera_mayor_infantil' ? 'order-2 md:order-1' : 'order-3 md:order-3');
                                    const sizeClass = isFM ? 'w-64 h-64 border-4' : 'w-48 h-48 border-2';
                                    const titleClass = isFM ? 'text-2xl mt-6' : 'text-xl';

                                    return (
                                        <div key={rep.id} className={`flex flex-col items-center ${orderClass}`}>
                                            <div className={`${sizeClass} rounded-full p-2.5 border-primary mb-6 relative group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 dark:from-surface-dark dark:to-black`}>
                                                <div
                                                    className="w-full h-full rounded-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                    style={{ backgroundImage: `url("${rep.image_url || 'https://via.placeholder.com/300'}")` }}
                                                ></div>
                                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap ring-4 ring-white dark:ring-[#111714]">
                                                    {getRoleLabel(rep.role)}
                                                </div>
                                                {isFM && (
                                                    <div className="absolute -top-6 text-primary left-1/2 -translate-x-1/2">
                                                        <span className="material-symbols-outlined text-4xl drop-shadow-md">crown</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className={`${titleClass} font-black dark:text-white mb-1`}>{rep.name}</h4>
                                            <p className="text-lg text-primary font-bold">{rep.year}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>

                <section className="bg-gray-50 dark:bg-surface-dark/50 rounded-2xl p-8 border border-gray-200 dark:border-border-dark">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-[#111714] dark:text-white mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history_edu</span>
                                Archivo Histórico
                            </h3>
                            <p className="text-gray-500 text-sm">Busca representantes de años anteriores en nuestro archivo digital.</p>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <div className="relative flex-1 md:w-72">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input
                                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white dark:bg-[#111714] border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[#111714] dark:text-white placeholder-gray-400"
                                    placeholder="Buscar por año o nombre..."
                                    type="text"
                                />
                            </div>
                            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-bold text-sm transition-colors shadow-md shadow-primary/20">
                                Buscar
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-solid border-[#29382f] bg-[#111714] text-white py-12 px-10 mt-auto">
                <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between gap-12">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 overflow-hidden relative opacity-90">
                                <img alt="Escudo Falla Turia" className="w-full h-full object-contain filter grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACJPSphHXzlwEdZRuZ5vOV0xHEUcXEnbr21_DgTa4cLH5aNqHxhKXVkXI-hARkh5MQEYjKtKUFScSAxVZl0p7qvMe4geGisvuLel6VNCNaDSxUabU4p10E1G63mD8_swumQYyj4pDlUgYJJf7JQfF9q9SpLUju_cJVBEvFMUV1q1gRQSwRVCxsVA2rQ0MbafKvINkOQ8y3I9l5luZuwXTb0Zk0n_7xN3OaCHknJQM63VUIAwcuP_yTg_do_qKN2JHpK3fZykgTfIc" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Falla Turia</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                            San Antonio de Benagéber. Pasión por las fallas, la cultura y la tradición valenciana desde nuestra fundación.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-sm">
                        <div className="flex flex-col gap-3">
                            <span className="font-bold text-white mb-2 uppercase tracking-wider text-xs text-primary">Enlaces</span>
                            <Link className="text-gray-400 hover:text-primary transition-colors" to="/">Inicio</Link>
                            <Link className="text-gray-400 hover:text-primary transition-colors" to="/institution">Institución</Link>
                            <Link className="text-gray-400 hover:text-primary transition-colors" to="/news">Noticias</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="font-bold text-white mb-2 uppercase tracking-wider text-xs text-primary">Legal</span>
                            <a className="text-gray-400 hover:text-primary transition-colors" href="#">Privacidad</a>
                            <a className="text-gray-400 hover:text-primary transition-colors" href="#">Cookies</a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="font-bold text-white mb-2 uppercase tracking-wider text-xs text-primary">Contacto</span>
                            <a className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2" href="#">
                                <span className="material-symbols-outlined text-[16px]">mail</span> info@fallaturia.com
                            </a>
                            <p className="text-gray-400 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">location_on</span> C/ Turia, 5
                            </p>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1280px] mx-auto mt-16 pt-8 border-t border-[#29382f] flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-gray-500">
                    <p>© 2024 Falla Turia. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <a className="hover:text-primary transition-colors" href="#">Instagram</a>
                        <a className="hover:text-primary transition-colors" href="#">Facebook</a>
                        <a className="hover:text-primary transition-colors" href="#">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
