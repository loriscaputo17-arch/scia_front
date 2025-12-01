"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { useTranslation } from "@/app/i18n";
 
export default function Instructions({ istructions, onClose }) {
    const [selectedImage, setSelectedImage] = useState(null);
    
    const images = [
        '/motor.jpg', '/motor.jpg', '/motor.jpg', 
        '/motor.jpg', '/motor.jpg', '/motor.jpg'
    ];

    const { t, i18n } = useTranslation("maintenance");
        const [mounted, setMounted] = useState(false);
          
        useEffect(() => {
          setMounted(true);
        }, []);
          
        if (!mounted || !i18n.isInitialized) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#000000ab] bg-opacity-50 z-2">
            <div className="bg-[#022a52] w-[50%] p-5 rounded-md shadow-lg text-white relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[26px] font-semibold">{t("assignment_team")}</h2>
                    <button className="text-white text-xl cursor-pointer" onClick={onClose}>
                        <svg width="24px" height="24px" fill="white" viewBox="0 0 384 512">
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                        </svg>
                    </button>
                </div>
                
                {istructions.attachment_link &&
                    <div className="flex overflow-x-auto gap-4 py-2 mb-4">
                        {/*{images.map((src, index) => (
                            <div key={index} className="w-20 h-20 relative cursor-pointer rounded-lg overflow-hidden" onClick={() => setSelectedImage(src)}>
                                <Image src={src} alt={`Motor ${index + 1}`} layout="fill" objectFit="cover" />
                            </div>
                        ))}*/}
                        <div className="w-20 h-20 relative cursor-pointer rounded-lg overflow-hidden" onClick={() => setSelectedImage(src)}>
                            <Image src={istructions.attachment_link} alt={`Image`} layout="fill" objectFit="cover" />
                        </div>
                    </div>
                }        

                <div className="text-sm">
                    <p>
                        {istructions.job.long_description}
                    </p>
                </div>

                <button className="w-full bg-[#789fd6] px-3 py-4 rounded-md mt-4 text-white font-semibold cursor-pointer" onClick={onClose}>
                    {t("close_button")}
                </button>
            </div>

            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-[#000000ab] bg-opacity-75 z-3">
                    <div className="relative w-[100%] p-5 rounded-lg">

                        <div className="w-full flex justify-center mb-4">
                            <Image src={selectedImage} alt="Selected" width={600} height={400} className="rounded-lg" style={{width: '70%'}} />
                        </div>

                        <button className="absolute top-3 right-3 text-white text-xl cursor-pointer" onClick={() => setSelectedImage(null)} style={{position: 'absolute', top: '8%', right: '4%', zIndex: '1000',}}>
                            <svg width="28px" height="28px" fill="white" viewBox="0 0 384 512">
                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                            </svg>
                        </button>

                        <div className="flex gap-4 overflow-x-auto justify-center" style={{position: 'absolute', left:'20%', bottom: '10%', zIndex: '1000',}}>
                            {images.map((src, index) => (
                                <div key={index} className="w-16 h-16 relative cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500"
                                     onClick={() => setSelectedImage(src)}>
                                    <Image src={src} alt={`Motor ${index + 1}`} layout="fill" objectFit="cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
