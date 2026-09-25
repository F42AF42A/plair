import {Raycaster,Vector3} from './three.module.js';
// Intersect only explicitly supplied stone meshes; living obstacles never enter this list.
export function createLidarTracer(){
 const raycaster=new Raycaster(),direction=new Vector3(),hits=[];
 return function trace(origin,target,rocks){
  direction.subVectors(target,origin);const distance=direction.length();
  if(distance<.001)return target.clone();
  direction.multiplyScalar(1/distance);raycaster.set(origin,direction);raycaster.near=.02;raycaster.far=distance;hits.length=0;
  raycaster.intersectObjects(rocks,false,hits);
  return hits.length?hits[0].point.clone().addScaledVector(direction,-.018):target.clone();
 };
}
