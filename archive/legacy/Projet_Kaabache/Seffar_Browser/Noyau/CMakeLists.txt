cmake_minimum_required(VERSION 3.15)
project(Seffar_Browser)

# Flags d'optimisation (niveau "O3 + LTO")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 -flto -march=native -fno-exceptions")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -O3 -flto -march=native")

# Dépendances critiques
find_package(PkgConfig REQUIRED)
pkg_check_modules(GTK3 REQUIRED gtk+-3.0)
find_package(OpenSSL REQUIRED)

# Cible principale
add_executable(seffar_browser
    src/main.cc
    src/engine/stealth.cc
    src/modules/webrtc_spoof.cc
)

# Linker les libs
target_link_libraries(seffar_browser
    ${GTK3_LIBRARIES}
    OpenSSL::SSL
    -lpthread
    -ldl
)