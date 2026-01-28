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

  // Check if device supports native fullscreen
  const supportsFullscreen = typeof document !== 'undefined' &&
    (document.documentElement.requestFullscreen ||
     (document.documentElement as any).webkitRequestFullscreen);

  // Handle fullscreen toggle - with mobile fallback
  const toggleFullscreen = useCallback(() => {
    if (!vrWrapperRef.current) return;

    if (!isFullscreen) {
      // Try native fullscreen first
      if ('requestFullscreen' in vrWrapperRef.current) {
        vrWrapperRef.current.requestFullscreen().catch(() => {
          // Fallback to CSS fullscreen
          setIsFullscreen(true);
        });
      } else if ((vrWrapperRef.current as any).webkitRequestFullscreen) {
        (vrWrapperRef.current as any).webkitRequestFullscreen();
      } else {
        // CSS fallback for iOS
        setIsFullscreen(true);
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitFullscreenElement) {
        (document as any).webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (!isNativeFullscreen && isFullscreen) {
        setIsFullscreen(false);
      }
      // Trigger resize
      setTimeout(() => {
        if (sceneRef.current && containerRef.current) {
          const newWidth = containerRef.current.clientWidth;
          const newHeight = containerRef.current.clientHeight;
          sceneRef.current.camera.aspect = newWidth / newHeight;
          sceneRef.current.camera.updateProjectionMatrix();
          sceneRef.current.renderer.setSize(newWidth, newHeight);
        }
      }, 100);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Handle escape key and back button for CSS fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen && !document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    const handlePopState = () => {
      if (isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isFullscreen]);

  // Resize handler for fullscreen changes
  useEffect(() => {
    if (sceneRef.current && containerRef.current) {
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      sceneRef.current.camera.aspect = newWidth / newHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(newWidth, newHeight);
    }
  }, [isFullscreen]);

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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
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

    // Controls for looking around - optimized for touch
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = -0.5;
    controls.zoomSpeed = 0.5;
    controls.minDistance = 0.1;
    controls.maxDistance = 100;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
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
    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
    setIsFullscreen(false);
    setIsVRActive(false);
    setIsLoading(true);
    setLoadProgress(0);
  };

  return (
    <section className={`relative bg-gradient-to-b from-gray-50 to-white flex items-center justify-center ${isFullscreen ? 'fixed inset-0 z-[9999] bg-black' : 'min-h-[50vh] md:min-h-[60vh]'}`}>
      {/* VR Tour Embed Area */}
      <div className={`w-full ${isFullscreen ? 'h-full' : 'max-w-6xl mx-auto px-2 sm:px-4 py-6 md:py-12'}`}>
        <div
          ref={vrWrapperRef}
          className={`bg-white overflow-hidden ${isFullscreen ? 'h-full rounded-none' : 'rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl'}`}
        >
          {/* VR Tour Header */}
          <div className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white ${isFullscreen ? 'p-2 md:p-3' : 'p-3 md:p-4'}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div className={`bg-white/20 rounded-lg flex items-center justify-center shrink-0 ${isFullscreen ? 'w-7 h-7' : 'w-8 h-8 md:w-10 md:h-10'}`}>
                  <svg
                    className={isFullscreen ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'}
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
                  <h2 className={`font-bold truncate ${isFullscreen ? 'text-xs' : 'text-sm md:text-lg'}`}>VR Factory Tour</h2>
                  {!isFullscreen && <p className="text-xs md:text-sm text-white/80 truncate hidden sm:block">360° Experience</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2 shrink-0">
                {isVRActive && (
                  <button
                    type="button"
                    onClick={handleExitVR}
                    className={`bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors ${isFullscreen ? 'px-2 py-1 text-[10px]' : 'px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm'}`}
                  >
                    Exit
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className={`bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors flex items-center gap-1 ${isFullscreen ? 'px-2 py-1 text-[10px]' : 'p-1.5 md:px-3 md:py-2 text-xs md:text-sm'}`}
                >
                  {isFullscreen ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  )}
                </button>
                {!isVRActive && (
                  <button
                    type="button"
                    onClick={handleEnterVR}
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-white text-orange-600 rounded-lg text-xs md:text-sm font-medium hover:bg-orange-50 transition-colors"
                  >
                    Start
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* VR Tour Content */}
          <div
            ref={containerRef}
            className={`relative bg-black flex items-center justify-center overflow-hidden ${isFullscreen ? 'h-[calc(100vh-50px)] md:h-[calc(100vh-60px)]' : 'aspect-[16/9] md:aspect-video'}`}
          >
            {/* Initial State - Before entering VR */}
            {!isVRActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 z-10 p-4">
                <div className="relative">
                  <svg
                    className="w-16 h-16 md:w-24 md:h-24 text-orange-500 animate-pulse"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <rect x="10" y="30" width="80" height="40" rx="10" fill="currentColor" opacity="0.2" />
                    <rect x="15" y="35" width="70" height="30" rx="8" stroke="currentColor" strokeWidth="3" />
                    <circle cx="35" cy="50" r="10" fill="currentColor" />
                    <circle cx="65" cy="50" r="10" fill="currentColor" />
                    <path d="M10 45 L5 50 L10 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M90 45 L95 50 L90 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M30 25 Q50 15 70 25" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="mt-4 md:mt-6 text-lg md:text-xl font-semibold text-gray-700 text-center">
                  Virtual Room Tour
                </h3>
                <p className="mt-2 text-sm md:text-base text-gray-500 text-center max-w-md px-4">
                  Explore the room in immersive 360° virtual reality
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
                  <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div
                      className="absolute inset-0 border-4 border-orange-500 rounded-full animate-spin"
                      style={{
                        borderTopColor: 'transparent',
                        borderRightColor: 'transparent',
                        animationDuration: '1s'
                      }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-sm md:text-base font-bold">
                      {loadProgress}%
                    </span>
                  </div>
                  <p className="text-sm md:text-base">Loading...</p>
                </div>
              </div>
            )}

            {/* VR Active Overlay Controls */}
            {isVRActive && !isLoading && (
              <div className={`absolute left-2 right-2 flex justify-between items-center z-10 pointer-events-none ${isFullscreen ? 'bottom-2' : 'bottom-2 md:bottom-4'}`}>
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 md:px-3 md:py-1.5 pointer-events-auto">
                  <p className="text-white text-[10px] md:text-xs">Drag to look</p>
                </div>
                <div className="flex gap-1 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (sceneRef.current) {
                        sceneRef.current.camera.fov = Math.max(30, sceneRef.current.camera.fov - 10);
                        sceneRef.current.camera.updateProjectionMatrix();
                      }
                    }}
                    className="bg-black/60 backdrop-blur-sm rounded-lg p-1.5 md:p-2 text-white active:bg-black/80"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
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
                    className="bg-black/60 backdrop-blur-sm rounded-lg p-1.5 md:p-2 text-white active:bg-black/80"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* VR Tour Controls - Hide in fullscreen */}
          {!isFullscreen && (
            <div className="bg-gray-50 p-2 md:p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isVRActive && !isLoading ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-xs text-gray-600">
                  {isVRActive && !isLoading ? 'Active' : 'Ready'}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                360° VR Tour
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards - Hide in fullscreen */}
        {!isFullscreen && (
          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-md border border-gray-100 text-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-xs md:text-sm">360° View</h3>
            </div>
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-md border border-gray-100 text-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-xs md:text-sm">Mobile Ready</h3>
            </div>
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-md border border-gray-100 text-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-xs md:text-sm">Fullscreen</h3>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
