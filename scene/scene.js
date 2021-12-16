// Written by Vince Dinh
// CSE 160, Professor James Davis @ UCSC, Fall 2021
// asg5.js
// Modified and adapted from https://threejs.org/manual/#en/fundamentals and other threejs.org tutorials
import * as THREE from '../lib/three.module.js';
import {OBJLoader} from '../lib/OBJLoader.js';
import {MTLLoader} from '../lib/MTLLoader.js';
import {OrbitControls} from '../lib/OrbitControls.js';

function main() {

    // canvas and renderer
    const canvas = document.querySelector('#c');
    const view1Elem = document.querySelector('#view1');
    const view2Elem = document.querySelector('#view2');
    const renderer = new THREE.WebGLRenderer({canvas});
  
    // camera stuff 
    // original view 
    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 18);
    const cameraHelper = new THREE.CameraHelper(camera);

    // second view
    const camera2 = new THREE.PerspectiveCamera(60, 2, 0.1, 500);
    camera2.position.set(0, 80, 0);
    camera2.lookAt(0, 10, 0);

    // orbit controls
    const controls = new OrbitControls(camera, view1Elem);
    controls.target.set(0, 5, 0);
    controls.update();

    const controls2 = new OrbitControls(camera2, view2Elem);
    controls2.target.set(0, 5, 0);
    controls2.update();
  
    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');

    // fog
    {
        const color = 0xFFFFFF;
        const near = 10;
        const far = 100;
        scene.fog = new THREE.Fog(color, near, far);
    }
  
    // ground plane (1)
    {
      const planeSize = 40;
  
      const loader = new THREE.TextureLoader();
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshBasicMaterial({color: 0x688094, side: THREE.DoubleSide});
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI * -.5;
      scene.add(mesh);
    }
  
    // sky and ground
    {
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);

        // background/skybox
        const loader = new THREE.CubeTextureLoader();
        const bgTex = loader.load([
          '../resources/img/skybox/nightcity-posx.jpg',
          '../resources/img/skybox/nightcity-negx.jpg',
          '../resources/img/skybox/nightcity-posy.jpg',
          '../resources/img/skybox/nightcity-negy.jpg',
          '../resources/img/skybox/nightcity-posz.jpg',
          '../resources/img/skybox/nightcity-negz.png'
        ]);
        scene.background = bgTex;
    }
    
    // cube stuff
    {
        // generic box
        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const boxGeo = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    
        // make instance of a cube
        function makeInstance(geometry, color, texture, x,y,z) {
    
            const cube = new THREE.Mesh(geometry, texture);
            scene.add(cube);
    
            cube.position.x = x;
            cube.position.y = y;
            cube.position.z = z;
    
            return cube;
        }

            // street (1)
            {
                const streetWidth = 10;
                const streetHeight = 1;
                const streetDepth = 40;
                const streetGeo = new THREE.BoxGeometry(streetWidth, streetHeight, streetDepth);
            
                // street texture
                const texLoader = new THREE.TextureLoader();
                const streetTex = new THREE.MeshPhongMaterial({
                map: texLoader.load('../resources/img/road.jpg'),
                });

                makeInstance(streetGeo, 0x3a4752, streetTex, 0,0,0);
            }

            // sidewalks & pavement (2)
            {
                const cementGeo = new THREE.BoxGeometry(15, 2, 40);
                const texLoader = new THREE.TextureLoader();
                const cementTex = new THREE.MeshPhongMaterial({
                color: 0x696a6b
                });

                makeInstance(cementGeo, 0x696a6b, cementTex, -12.5,0,0);
                makeInstance(cementGeo, 0x696a6b, cementTex, 12.5,0,0);
            } 

            // buildings
            {
                const building1Geo = new THREE.BoxGeometry(10, 30, 10);
                const building2Geo = new THREE.BoxGeometry(10, 40, 10);
                const building3Geo = new THREE.BoxGeometry(10, 45, 10);
                const building4Geo = new THREE.BoxGeometry(10, 35, 10);
                const texLoader = new THREE.TextureLoader();
                const building1Tex = new THREE.MeshPhongMaterial({
                    color: 0x2e2e2e
                });
                const building2Tex = new THREE.MeshPhongMaterial({
                    color: 0x242424
                });
                const building3Tex = new THREE.MeshPhongMaterial({
                    color: 0x19191a
                });
                const building4Tex = new THREE.MeshPhongMaterial({
                    color: 0x212121
                });

                // left side (4)
                makeInstance(building1Geo, 0x2e2e2e, building1Tex, -20,10,-15);
                makeInstance(building2Geo, 0x242424, building2Tex, -23,10,-5);
                makeInstance(building3Geo, 0x19191a, building3Tex, -21,10,5);
                makeInstance(building4Geo, 0x212121, building4Tex, -20,10,15);

                // right side (4)
                makeInstance(building3Geo, 0x19191a, building3Tex, 20,10,-15);
                makeInstance(building2Geo, 0x242424, building2Tex, 21,10,-5);
                makeInstance(building4Geo, 0x212121, building4Tex, 23,10,5);
                makeInstance(building2Geo, 0x242424, building2Tex, 20,10,15);
            }

    }

    // sphere stuff
        function makeSphereInstance(geometry, color, texture, x,y,z) {
    
            const sphere = new THREE.Mesh(geometry, texture);
            scene.add(sphere);
    
            sphere.position.x = x;
            sphere.position.y = y;
            sphere.position.z = z;
    
            return sphere;
        }

        // lanterns (3)
        const radius = 1;  
        const widthSegments = 12;  
        const heightSegments = 8;  
        const lanternGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const texLoader = new THREE.TextureLoader();
        const lanternTex = new THREE.MeshPhongMaterial({
        map: texLoader.load('../resources/img/lantern.jpg'),
        color: 0xffebc9
        });

        const lanterns = [
            makeSphereInstance(lanternGeo, 0xffebc9, lanternTex,  -5, 10, -5),
            makeSphereInstance(lanternGeo, 0xffebc9, lanternTex,  5, 11, -6),
            makeSphereInstance(lanternGeo, 0xffebc9, lanternTex,  2, 13, -5.5)
        ];
    
    // cylinder stuff
        function makeCylInstance(geometry, color, texture, x,y,z, rotate) {
        
            const cyl = new THREE.Mesh(geometry, texture);
            scene.add(cyl);

            cyl.position.x = x;
            cyl.position.y = y;
            cyl.position.z = z;

            if(rotate == 1){
                cyl.rotation.x = THREE.Math.degToRad(90);
                cyl.rotation.z = THREE.Math.degToRad(69);
            }

            return cyl;
        }
        

        const lamppoleradiusTop = 0.2;  
        const lamppoleradiusBottom = 0.2;  
        const lamppoleheight = 12;  
        const radialSegments = 8;  
        const lamppoleGeo = new THREE.CylinderGeometry(lamppoleradiusTop, lamppoleradiusBottom, lamppoleheight, radialSegments);
        const lamplightGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, radialSegments);
        const lamptopGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, radialSegments);
        const lamppoleTex = new THREE.MeshPhongMaterial({color: 0x858585});
        const lamplightTex = new THREE.MeshPhongMaterial({color: 0xcfd1a5});

        // lamp1 (3)
        makeCylInstance(lamppoleGeo, 0x858585, lamppoleTex, 7, 2, -3, 0)
        makeCylInstance(lamplightGeo, 0xcfd1a5, lamplightTex, 7, 8, -3, 0)
        makeCylInstance(lamptopGeo, 0xcfd1a5, lamppoleTex, 7, 8.5, -3, 0)

        // lamp2 (3)
        makeCylInstance(lamppoleGeo, 0x858585, lamppoleTex, -7, 2, 8, 0)
        makeCylInstance(lamplightGeo, 0xcfd1a5, lamplightTex, -7, 8, 8, 0)
        makeCylInstance(lamptopGeo, 0xcfd1a5, lamppoleTex, -7, 8.5, 8, 0)


        // cans (2)
        const canTop = 0.2;  
        const canBottom = 0.2;  
        const canheight = 0.6;  
        const canGeo = new THREE.CylinderGeometry(canTop, canBottom, canheight, radialSegments);
        const canTex = new THREE.MeshPhongMaterial({color: 0xcc2d2d});
        makeCylInstance(canGeo, 0xcc2d2d, canTex, 7, 1.3, -2, 0);
        makeCylInstance(canGeo, 0xcc2d2d, canTex, 7, 1.2, -0.8, 1);

        // spill (2)
        const spill1Geo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, radialSegments);
        const spill2Geo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, radialSegments);
        const spillTex = new THREE.MeshPhongMaterial({color: 0x210f0b});
        makeCylInstance(spill1Geo, 0x210f0b, spillTex, 6.3, 1, -0.6, 0);
        makeCylInstance(spill2Geo, 0x210f0b, spillTex, 5.8, 1, -0.8, 0);


        // signpole (1)
        const signpoleGeo = new THREE.CylinderGeometry(lamppoleradiusTop, lamppoleradiusBottom, 4, radialSegments);
        makeCylInstance(signpoleGeo, 0x858585, lamppoleTex, 10, 2, 15, 0)
        // sign (1)
        const signGeo = new THREE.BoxGeometry(4, 1, 0.2);
        const signTex = new THREE.MeshPhongMaterial({ 
            map: texLoader.load('../resources/img/sushisign.PNG'),
            color: 0x858585});
        const sign = new THREE.Mesh(signGeo, signTex);
        scene.add(sign);
        sign.position.set(10, 4.5, 15);

        // sushi stand legs (4)
        const sushistandlegGeo = new THREE.CylinderGeometry(lamppoleradiusTop, lamppoleradiusBottom, 2, radialSegments);
        const sushistandTex = new THREE.MeshPhongMaterial({ color: 0x331e11});
        makeCylInstance(sushistandlegGeo, 0x331e11, sushistandTex, 10, 1, 12, 0);
        makeCylInstance(sushistandlegGeo, 0x331e11, sushistandTex, 12, 1, 12, 0);
        makeCylInstance(sushistandlegGeo, 0x331e11, sushistandTex, 10, 1, 8, 0);
        makeCylInstance(sushistandlegGeo, 0x331e11, sushistandTex, 12, 1, 8, 0);
        // sushi stand table (1)
        const sushistandtableGeo = new THREE.BoxGeometry(2.5, 0.3, 4.5);
        const sushistandtableTex = new THREE.MeshPhongMaterial({ color: 0x331e11});
        const sushistandtable = new THREE.Mesh(sushistandtableGeo, sushistandtableTex);
        scene.add(sushistandtable);
        sushistandtable.position.set(11, 2.1, 10);
        // sushi stand poles (2)
        makeCylInstance(sushistandlegGeo, 0x331e11, sushistandTex, 11, 3, 12, 0);
        makeCylInstance(sushistandlegGeo, 0x331e11, sushistandTex, 11, 3, 8, 0);
        // sushi stand roof (1)
        const roofGeo = new THREE.CylinderGeometry(3, 3, 0.2, 24);
        const roofTex = new THREE.MeshPhongMaterial({ color: 0x9c5181});
        makeCylInstance(roofGeo, 0x331e11, roofTex, 11, 4, 10, 0);

        // planter (2)
        const planterGeo = new THREE.BoxGeometry(3, 2, 3);
        const planterTex = new THREE.MeshPhongMaterial({ 
            color: 0x737373});
        const planter = new THREE.Mesh(planterGeo, planterTex);
        scene.add(planter);
        planter.position.set(-10, 2, 5);

        const planterDirtGeo = new THREE.BoxGeometry(2.5, 2, 2.5);
        const planterDirtTex = new THREE.MeshPhongMaterial({ 
            color: 0x614e3b});
        const planterDirt = new THREE.Mesh(planterDirtGeo, planterDirtTex);
        scene.add(planterDirt);
        planterDirt.position.set(-10, 2.2, 5);

        // tree (2)
        const treeTrunkGeo = new THREE.BoxGeometry(1, 4, 1);
        const treeTrunkTex = new THREE.MeshPhongMaterial({ 
            color: 0x331e11});
        const treeTrunk = new THREE.Mesh(treeTrunkGeo, treeTrunkTex);
        scene.add(treeTrunk);
        treeTrunk.position.set(-10, 5, 5);

        const leafGeo = new THREE.SphereGeometry(2, widthSegments, heightSegments);
        const leafTex = new THREE.MeshPhongMaterial({
            color: 0x1d571b});
        makeSphereInstance(leafGeo, 0xffebc9, leafTex,  -10, 7, 5);

    // lighting
    {
        // Neon directional light (adds neon blue hue)
        const color = 0x24a6bd;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 20, 5);
        scene.add(light);

        // lamp1 point light
        const color1 = 0xe1e68c;
        const intensity1 = 0.1;
        const light1 = new THREE.PointLight(color1, intensity1);
        light1.position.set(7, 8, -3);
        scene.add(light1);



        // lamp2 point light
        const color2 = 0xc7cc60;
        const intensity2 = 0.9;
        const light2 = new THREE.PointLight(color2, intensity2);
        light2.position.set(-7, 8, 8);
        scene.add(light2);


        // sushi sign point light
        const color3 = 0xe01212;
        const intensity3 = 0.7;
        const light3 = new THREE.SpotLight(color3, intensity3);
        light3.position.set(10, 4.5, 15);
        scene.add(light3);
        scene.add(light3.target);
        light3.target.position.set(20,4.5,15);

        // light visualizers
        const helper = new THREE.DirectionalLight(light);
        const helper1 = new THREE.PointLightHelper(light1);
        const helper2 = new THREE.PointLightHelper(light2);
        const helper3 = new THREE.SpotLightHelper(light3);
        //scene.add(helper);
        //scene.add(helper1);
        //scene.add(helper2);
        //scene.add(helper3);

        function updateLight() {
            helper.update();
            helper1.update();
            helper2.update();
            helper3.update();
        }
    }
  
    // Object and object material loaders
    {
        // Torii Gate by Hattie Stroud [CC-BY], via Poly Pizza
        const mtlLoader = new MTLLoader();
        mtlLoader.load('../resources/models/torii.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('../resources/models/torii.obj', (root) => {
                root.scale.x = 60;
                root.scale.y = 60;
                root.scale.z = 60;
                root.position.set(0.1, 12, -10);
                root.rotation.y = THREE.Math.degToRad(225);
                root.rotation.z = THREE.Math.degToRad(1);
                scene.add(root);
                //const container = new THREE.Box3().setFromObject(root);
                //const containerSize = container.getSize(new THREE.Vector3()).length();
                //const containerCenter = container.getCenter(new THREE.Vector3());
                //console.log(containerSize);
                //console.log(containerCenter);

            });
        });

        // Vending Machine by Don Carson [CC-BY], via Poly Pizza
        mtlLoader.load('../resources/models/vending.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('../resources/models/vending.obj', (root) => {
                root.scale.x = 2;
                root.scale.y = 2;
                root.scale.z = 2;
                root.position.set(-16,4,-5);
                root.rotation.y = THREE.Math.degToRad(-90);
                scene.add(root);
            });
        });

        // Police Car by Quaternius [CC0], via Poly Pizza
        mtlLoader.load('../resources/models/policecar.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('../resources/models/policecar.obj', (root) => {
                root.scale.x = 2;
                root.scale.y = 2;
                root.scale.z = 2;
                root.position.set(2,0.5,-3);
                root.rotation.y = THREE.Math.degToRad(180);
                scene.add(root);
            });
        });

        // Sports Car by Quaternius [CC0], via Poly Pizza
        mtlLoader.load('../resources/models/SportsCar.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('../resources/models/SportsCar.obj', (root) => {
                root.scale.x = 2;
                root.scale.y = 2;
                root.scale.z = 2;
                root.position.set(-2,0.5,5);
                root.rotation.y = THREE.Math.degToRad(180);
                scene.add(root);
            });
        });

        // Boombox by Poly by Google [CC-BY], via Poly Pizza
        mtlLoader.load('../resources/models/Boombox.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('../resources/models/Boombox.obj', (root) => {
                root.updateMatrixWorld();
                root.scale.x = 1;
                root.scale.y = 1;
                root.scale.z = 1;
                root.position.set(-6,1,15);
                root.rotation.y = THREE.Math.degToRad(83);
                scene.add(root);
                const container = new THREE.Box3().setFromObject(root);
                const containerSize = container.getSize(new THREE.Vector3()).length();
                const containerCenter = container.getCenter(new THREE.Vector3());
                console.log(containerSize);
                console.log(containerCenter);
            });
        });

        // Sushi by Юрий Нечаев [CC-BY], via Poly Pizza
        mtlLoader.load('../resources/models/sushi.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('../resources/models/sushi.obj', (root) => {
                root.scale.x = 3;
                root.scale.y = 3;
                root.scale.z = 3;
                root.position.set(11, 2.5, 10);
                root.rotation.y = THREE.Math.degToRad(130);
                scene.add(root);
            });
        });

    }

    // Helper function to make billboard
    function makeLabelCanvas(baseWidth, size, name) {
        const borderSize = 2;
        const ctx = document.createElement('canvas').getContext('2d');
        const font =  `${size}px bold sans-serif`;
        ctx.font = font;
        // measure how long the name will be
        const textWidth = ctx.measureText(name).width;
    
        const doubleBorderSize = borderSize * 2;
        const width = baseWidth + doubleBorderSize;
        const height = size + doubleBorderSize;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
    
        // need to set font again after resizing canvas
        ctx.font = font;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
    
        ctx.fillStyle = 'pink';
        ctx.fillRect(0, 0, width, height);
    
        // scale to fit but don't stretch
        const scaleFactor = Math.min(1, baseWidth / textWidth);
        ctx.translate(width / 2, height / 2);
        ctx.scale(scaleFactor, 1);
        ctx.fillStyle = 'white';
        ctx.fillText(name, 0, 0);
    
        return ctx.canvas;
    }

    // billboard for sushi
    {
        const canvas = makeLabelCanvas(400, 50, 'UMAI (delicious)!');
        const texture = new THREE.CanvasTexture(canvas);

        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
    
        const labelMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
        });

        const root = new THREE.Object3D();
        root.position.x = 11;
    
        const label = new THREE.Sprite(labelMaterial);
        root.add(label);
        label.position.y = 5
        label.position.z = 10
    

        const labelBaseScale = 0.01;
        label.scale.x = canvas.width  * labelBaseScale;
        label.scale.y = canvas.height * labelBaseScale;
    
        scene.add(root);
    }

    // resizes renderer to fit browser
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function setScissorForElement(elem) {
        const canvasRect = canvas.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();
       
        // compute a canvas relative rectangle
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);
       
        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);
       
        // setup the scissor to only render to that part of the canvas
        const positiveYUpBottom = canvasRect.height - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);
       
        // return the aspect
        return width / height;
    }

    // renders and animates
    function render(time) {

        
        resizeRendererToDisplaySize(renderer);

        // turn on the scissor
        renderer.setScissorTest(true);
  
        time *= 0.001;  // convert time to seconds

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // rotates lanterns
        lanterns.forEach((sphere, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        sphere.rotation.y = rot;
        });

        // rotates sign
        const speed = 1 + 0.5 * .1;
        const rot = time * speed;
        sign.rotation.y = rot;


        // render the original view
        {
            const aspect = setScissorForElement(view1Elem);
    
            // adjust the camera for this aspect
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            cameraHelper.update();
    
            // don't draw the camera helper in the original view
            cameraHelper.visible = false;

    
            // render
            renderer.render(scene, camera);
        }

        // render from the 2nd camera
        {
            const aspect = setScissorForElement(view2Elem);

            // adjust the camera for this aspect
            camera2.aspect = aspect;
            camera2.updateProjectionMatrix();

            // draw the camera helper in the 2nd view
            cameraHelper.visible = true;
            scene.fog.visible = false;


            renderer.render(scene, camera2);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}


function addActionsForHtmlUI(){

}
  
main();

