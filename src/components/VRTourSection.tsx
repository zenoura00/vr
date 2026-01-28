"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 360° panoramic image - compressed local version
const PANORAMA_URL = "/panorama.jpg";

export default function VRTourSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVRActive, setIsVRActive] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const vrWrapperRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    animationId: number;
  } | null>(null);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!vrWrapperRef.current) return;

    if (!document.fullscreenElement) {
      vrWrapperRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error entering fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Trigger resize when fullscreen changes
      if (sceneRef.current && containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        sceneRef.current.camera.aspect = newWidth / newHeight;
        sceneRef.current.camera.updateProjectionMatrix();
        sceneRef.current.renderer.setSize(newWidth, newHeight);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!isVRActive || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create sphere geometry for 360° view
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere

    // Load panoramic texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      PANORAMA_URL,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        setIsLoading(false);
        setLoadProgress(100);
      },
      (progress) => {
        if (progress.total > 0) {
          setLoadProgress(Math.round((progress.loaded / progress.total) * 100));
        }
      },
      (error) => {
        console.error("Error loading panorama:", error);
        setIsLoading(false);
      }
    );

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Controls for looking around - optimized for touch
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = -0.3;
    controls.minDistance = 0.1;
    controls.maxDistance = 100;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    const animationId = requestAnimationFrame(animate);

    sceneRef.current = { scene, camera, renderer, controls, animationId };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        sceneRef.current.controls.dispose();
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isVRActive]);

  const handleEnterVR = () => {
    setIsVRActive(true);
    setIsLoading(true);
    setLoadProgress(0);
  };

  const handleExitVR = () => {
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsVRActive(false);
    setIsLoading(true);
    setLoadProgress(0);
  };

  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      {/* VR Tour Embed Area */}
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-6 md:py-12">
        <div
          ref={vrWrapperRef}
          className={`bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none max-w-none' : ''}`}
        >
          {/* VR Tour Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 md:p-4 text-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm md:text-lg truncate">VR Factory Tour</h2>
                  <p className="text-xs md:text-sm text-white/80 truncate hidden sm:block">Explore our solar manufacturing facility</p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2 shrink-0">
                {isVRActive && (
                  <button
                    type="button"
                    onClick={handleExitVR}
                    className="px-2 md:px-4 py-1.5 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs md:text-sm font-medium transition-colors"
                  >
                    <span className="hidden sm:inline">Exit Tour</span>
                    <span className="sm:hidden">Exit</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 md:px-4 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1 md:gap-2"
                >
                  {isFullscreen ? (
                    <>
                      <svg className="w-4 h-4 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="hidden md:inline">Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="hidden md:inline">Fullscreen</span>
                    </>
                  )}
                </button>
                {!isVRActive && (
                  <button
                    type="button"
                    onClick={handleEnterVR}
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-white text-orange-600 rounded-lg text-xs md:text-sm font-medium hover:bg-orange-50 transition-colors"
                  >
                    <span className="hidden sm:inline">Start Tour</span>
                    <span className="sm:hidden">Start</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* VR Tour Content */}
          <div
            ref={containerRef}
            className={`relative bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden ${isFullscreen ? 'h-[calc(100vh-60px)] md:h-[calc(100vh-80px)]' : 'aspect-[4/3] md:aspect-video'}`}
          >
            {/* Initial State - Before entering VR */}
            {!isVRActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/5 z-10 p-4">
                <div className="relative">
                  {/* VR Headset Icon */}
                  <svg
                    className="w-16 h-16 md:w-24 md:h-24 text-orange-500 animate-pulse"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <rect
                      x="10"
                      y="30"
                      width="80"
                      height="40"
                      rx="10"
                      fill="currentColor"
                      opacity="0.2"
                    />
                    <rect
                      x="15"
                      y="35"
                      width="70"
                      height="30"
                      rx="8"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <circle cx="35" cy="50" r="10" fill="currentColor" />
                    <circle cx="65" cy="50" r="10" fill="currentColor" />
                    <path
                      d="M10 45 L5 50 L10 55"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M90 45 L95 50 L90 55"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M30 25 Q50 15 70 25"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 md:mt-6 text-lg md:text-xl font-semibold text-gray-700 text-center">
                  Virtual Factory Tour
                </h3>
                <p className="mt-2 text-sm md:text-base text-gray-500 text-center max-w-md px-4">
                  Experience our state-of-the-art solar panel manufacturing facility in immersive 360° virtual reality
                </p>
                <button
                  type="button"
                  onClick={handleEnterVR}
                  className="mt-4 md:mt-6 px-6 md:px-8 py-2.5 md:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm md:text-base font-medium transition-colors shadow-lg shadow-orange-500/30"
                >
                  Enter VR Experience
                </button>
              </div>
            )}

            {/* Loading State */}
            {isVRActive && isLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-20">
                <div className="text-center text-white">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
                    <svg className="w-20 h-20 md:w-24 md:h-24 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-white/20 md:hidden"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className="text-orange-500 md:hidden"
                        strokeDasharray={`${loadProgress * 2.2} 220`}
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-white/20 hidden md:block"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className="text-orange-500 hidden md:block"
                        strokeDasharray={`${loadProgress * 2.51} 251`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-base md:text-lg font-bold">
                      {loadProgress}%
                    </span>
                  </div>
                  <p className="text-base md:text-lg">Loading VR Environment...</p>
                  <p className="text-xs md:text-sm text-gray-400 mt-2">Preparing 360° factory view</p>
                </div>
              </div>
            )}

            {/* VR Active Overlay Controls */}
            {isVRActive && !isLoading && (
              <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 flex justify-between items-center z-10 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 md:px-4 py-1.5 md:py-2 pointer-events-auto">
                  <p className="text-white text-xs md:text-sm">
                    <span className="hidden sm:inline">Drag to look around</span>
                    <span className="sm:hidden">Touch & drag</span>
                  </p>
                </div>
                <div className="flex gap-1 md:gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (sceneRef.current) {
                        sceneRef.current.camera.fov = Math.max(30, sceneRef.current.camera.fov - 10);
                        sceneRef.current.camera.updateProjectionMatrix();
                      }
                    }}
                    className="bg-black/50 backdrop-blur-sm rounded-lg p-2 md:px-3 md:py-2 text-white hover:bg-black/70 transition-colors"
                    title="Zoom In"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (sceneRef.current) {
                        sceneRef.current.camera.fov = Math.min(100, sceneRef.current.camera.fov + 10);
                        sceneRef.current.camera.updateProjectionMatrix();
                      }
                    }}
                    className="bg-black/50 backdrop-blur-sm rounded-lg p-2 md:px-3 md:py-2 text-white hover:bg-black/70 transition-colors"
                    title="Zoom Out"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* VR Tour Controls - Hide in fullscreen */}
          {!isFullscreen && (
            <div className="bg-gray-50 p-2 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${isVRActive && !isLoading ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-xs md:text-sm text-gray-600">
                    {isVRActive && !isLoading ? 'Active' : 'Ready'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
                <span className="hidden sm:inline">Drag to look</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden md:inline">Pinch to zoom</span>
                <span className="hidden md:inline">•</span>
                <span>360° view</span>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards - Hide in fullscreen */}
        {!isFullscreen && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-8">
            <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md md:shadow-lg border border-gray-100">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1 md:mb-2">Production Lines</h3>
              <p className="text-xs md:text-sm text-gray-500">Explore our automated solar panel manufacturing lines</p>
            </div>
            <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md md:shadow-lg border border-gray-100">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1 md:mb-2">Quality Control</h3>
              <p className="text-xs md:text-sm text-gray-500">See our rigorous testing and quality assurance processes</p>
            </div>
            <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md md:shadow-lg border border-gray-100">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1 md:mb-2">Solar Innovation</h3>
              <p className="text-xs md:text-sm text-gray-500">Discover our latest solar technology developments</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
