"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 360° panoramic image of a solar factory
const PANORAMA_URL = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=4096&h=2048&fit=crop";

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

    // Controls for looking around
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = -0.25;
    controls.minDistance = 0.1;
    controls.maxDistance = 100;

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
    <section className="relative min-h-[60vh] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      {/* VR Tour Embed Area */}
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <div
          ref={vrWrapperRef}
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none max-w-none' : ''}`}
        >
          {/* VR Tour Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
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
                <div>
                  <h2 className="font-bold text-lg">VR Factory Tour</h2>
                  <p className="text-sm text-white/80">Explore our solar manufacturing facility</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isVRActive && (
                  <button
                    type="button"
                    onClick={handleExitVR}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    Exit Tour
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {isFullscreen ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Exit Fullscreen
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      Fullscreen
                    </>
                  )}
                </button>
                {!isVRActive && (
                  <button
                    type="button"
                    onClick={handleEnterVR}
                    className="px-4 py-2 bg-white text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
                  >
                    Start Tour
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* VR Tour Content */}
          <div
            ref={containerRef}
            className={`relative bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'aspect-video'}`}
          >
            {/* Initial State - Before entering VR */}
            {!isVRActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/5 z-10">
                <div className="relative">
                  {/* VR Headset Icon */}
                  <svg
                    className="w-24 h-24 text-orange-500 animate-pulse"
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
                <h3 className="mt-6 text-xl font-semibold text-gray-700">
                  Virtual Factory Tour
                </h3>
                <p className="mt-2 text-gray-500 text-center max-w-md">
                  Experience our state-of-the-art solar panel manufacturing facility in immersive 360° virtual reality
                </p>
                <button
                  type="button"
                  onClick={handleEnterVR}
                  className="mt-6 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-colors shadow-lg shadow-orange-500/30"
                >
                  Enter VR Experience
                </button>
              </div>
            )}

            {/* Loading State */}
            {isVRActive && isLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-20">
                <div className="text-center text-white">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-white/20"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className="text-orange-500"
                        strokeDasharray={`${loadProgress * 2.51} 251`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                      {loadProgress}%
                    </span>
                  </div>
                  <p className="text-lg">Loading VR Environment...</p>
                  <p className="text-sm text-gray-400 mt-2">Preparing 360° factory view</p>
                </div>
              </div>
            )}

            {/* VR Active Overlay Controls */}
            {isVRActive && !isLoading && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 pointer-events-auto">
                  <p className="text-white text-sm">Drag to look around</p>
                </div>
                <div className="flex gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (sceneRef.current) {
                        sceneRef.current.camera.fov = Math.max(30, sceneRef.current.camera.fov - 10);
                        sceneRef.current.camera.updateProjectionMatrix();
                      }
                    }}
                    className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white hover:bg-black/70 transition-colors"
                    title="Zoom In"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
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
                    className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white hover:bg-black/70 transition-colors"
                    title="Zoom Out"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* VR Tour Controls - Hide in fullscreen */}
          {!isFullscreen && (
            <div className="bg-gray-50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isVRActive && !isLoading ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600">
                    {isVRActive && !isLoading ? 'VR Tour Active' : 'Live Tour Available'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>Drag to look around</span>
                <span>•</span>
                <span>Scroll to zoom</span>
                <span>•</span>
                <span>VR headset supported</span>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards - Hide in fullscreen */}
        {!isFullscreen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Production Lines</h3>
              <p className="text-sm text-gray-500">Explore our automated solar panel manufacturing lines</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Quality Control</h3>
              <p className="text-sm text-gray-500">See our rigorous testing and quality assurance processes</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Solar Innovation</h3>
              <p className="text-sm text-gray-500">Discover our latest solar technology developments</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
