"use client";

import Link from "next/link";
import { Youtube, Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

const solutions = [
  "Sistema Comercial de 50 kW",
  "ESS residencial",
  "Soluciones de ESS comerciales e industriales",
  "Sistema de almacenamiento comercial",
  "Balcón Ess",
];

const projectCases = [
  {
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=300&h=200&fit=crop",
    title: "200 Conjuntos Sistema De Batería De Litio Solar Instalado En Bangkok",
    link: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop",
    title: "Sistema De Energía Solar De 120kVA En Mali",
    link: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=300&h=200&fit=crop",
    title: "120 Conjuntos De 45kW Sistema De Energía Solar En El Líbano",
    link: "#",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#332b2b] text-white">
      {/* Project Cases Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 md:py-10">
          <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider mb-4 md:mb-6">
            CONOZCA MÁS SOBRE NOSOTROS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projectCases.map((project) => (
              <div key={project.title} className="flex gap-3 md:gap-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-20 h-14 md:w-28 md:h-20 object-cover rounded shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-300 line-clamp-2 leading-snug">
                    {project.title}
                  </p>
                  <Link
                    href={project.link}
                    className="text-xs md:text-sm text-orange-500 hover:text-orange-400 transition-colors mt-1 md:mt-2 inline-block"
                  >
                    Más información
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Logo and Contact Info */}
          <div className="col-span-2 md:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl md:text-2xl">f</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl tracking-wider">
                  <span className="text-orange-500 font-semibold">F</span>
                  <span className="text-white">elicity</span>
                  <span className="text-gray-400">solar</span>
                  <sup className="text-gray-500 text-xs">®</sup>
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 italic -mt-1">
                  Make life full of hope
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider mb-3 md:mb-4">
              INFORMACIÓN DE CONTACTO
            </h3>
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 shrink-0" />
                <span>Principal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 shrink-0" />
                <span>(786) 642-2168</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 shrink-0" />
                <span className="truncate">northamerica@felicitysolar.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 mt-4 md:mt-6">
              <Link
                href="#"
                className="w-7 h-7 md:w-8 md:h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Youtube className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
              <Link
                href="#"
                className="w-7 h-7 md:w-8 md:h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
              <Link
                href="#"
                className="w-7 h-7 md:w-8 md:h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
              <Link
                href="#"
                className="w-7 h-7 md:w-8 md:h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider mb-3 md:mb-4">
              SOLUCIÓN
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {solutions.map((solution) => (
                <li key={solution}>
                  <Link
                    href="#"
                    className="text-xs md:text-sm text-gray-400 hover:text-orange-500 transition-colors line-clamp-1"
                  >
                    {solution}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider mb-3 md:mb-4">
              PRODUCTOS
            </h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  Inversores Solares
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  Baterías de Litio
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  Paneles Solares
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  Controladores
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  Sistemas ESS
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 md:py-4">
          <p className="text-center text-xs md:text-sm text-gray-500">
            © Felicitysolar All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
