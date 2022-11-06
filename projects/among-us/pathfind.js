"use strict";{const t=Math.pow(2,26),e=t-1;function s(e,s){return e*t+s}const i=new Map;function n(t){let e=i.get(t);return e||(e=new r,i.set(t,e)),e}self.JobHandlers.PFCellData=function(t){const e=t.mapKey,s=t.hcells,i=t.vcells,l=t.cellData,a=t.diagonals;n(e).Init(s,i,l,a)},self.JobHandlers.PFUpdateRegion=function(t){const e=t.mapKey,s=t.cx1,i=t.cy1,l=t.lenx,a=t.leny,r=t.cellData;n(e).UpdateRegion(s,i,l,a,r)},self.JobHandlers.PFSetDiagonals=function(t){const e=t.mapKey,s=t.diagonals;n(e).SetDiagonalsEnabled(s)},self.JobHandlers.PFResetAllCellData=function(t){for(const t of i.values())t.Clear()},self.JobHandlers.PFFindPath=function(t){const e=t.mapKey,s=t.cellX,i=t.cellY,l=t.destCellX,a=t.destCellY,r=n(e);performance.now();return{result:r.FindPath(s,i,l,a)}};let l=0;class a{constructor(t,e){this._parent=null,this._x=t||0,this._y=e||0,this._f=0,this._g=0,this._h=0,this._seq=l++}SetXY(t,e){this._x=t,this._y=e}DirectionTo(t){const e=this._x,s=this._y,i=t._x,n=t._y;if(e===i){if(n>s)return 6;if(n<s)return 2;if(s===n)return 8}else if(s===n){if(i>e)return 4;if(n<e)return 0}else{if(i<e&&n<s)return 1;if(i>e&&n<s)return 3;if(i<e&&n>s)return 7;if(i>e&&n>s)return 5}return 8}static Sort(t,e){const s=t._f,i=e._f;return s!==i?s-i:t._seq-e._seq}}class r{constructor(){this._hcells=0,this._vcells=0,this._cells=null,this._openList=new self.RedBlackSet(a.Sort),this._openMap=new Map,this._closedSet=new Set,this._currentNode=null,this._targetX=0,this._targetY=0,this._diagonalsEnabled=!0}Init(t,e,s,i){this._hcells=t,this._vcells=e,this._cells=s,this._diagonalsEnabled=!!i}UpdateRegion(t,e,s,i,n){const l=this._cells;if(l)for(let i=0;i<s;++i)l[t+i].set(n[i],e)}Clear(){this._cells=null}_ClearIntermediateData(){this._openList.Clear(),this._openMap.clear(),this._closedSet.clear(),this._currentNode=null,l=0}UpdateRegion(t,e,s,i,n){for(let l=0;l<s;++l)for(let s=0;s<i;++s)this._cells[t+l][e+s]=n[l][s]}SetDiagonalsEnabled(t){this._diagonalsEnabled=!!t}At(t,s){return t<0||s<0||t>=this._hcells||s>=this._vcells?e:this._cells[t][s]}FindPath(t,e,s,i){if(!this._cells)return null;t=Math.floor(t),e=Math.floor(e),s=Math.floor(s),i=Math.floor(i),this._targetX=s,this._targetY=i;const n=Math.min(t,s),l=Math.max(t,s),a=Math.min(e,i),r=Math.max(e,i);if(n<0||a<0||l>=this._hcells||r>=this._vcells)return null;if(this._diagonalsEnabled){let t=!0;for(let e=n;e<=l;++e)for(let s=a;s<=r;++s)if(0!==this._cells[e][s]){t=!1,e=l+1;break}if(t)return[{x:s,y:i}]}return this._AStarFindPath(t,e)}_AStarFindPath(t,i){const n=this._diagonalsEnabled,l=this._openList,r=this._openMap,_=this._closedSet,h=new a(t,i);for(l.Add(h),r.set(s(t,i),h);!l.IsEmpty();){const t=l.Shift(),i=s(t._x,t._y);if(r.delete(i),_.add(i),t._x===this._targetX&&t._y===this._targetY)return this._ClearIntermediateData(),this._GetResultPath(t);this._currentNode=t;const a=t._x,h=t._y,o=this.At(a-1,h)===e,d=this.At(a,h-1)===e,c=this.At(a+1,h)===e,u=this.At(a,h+1)===e;o||this._AddCellToOpenList(a-1,h,10),!n||o||d||this.At(a-1,h-1)===e||this._AddCellToOpenList(a-1,h-1,14),d||this._AddCellToOpenList(a,h-1,10),!n||d||c||this.At(a+1,h-1)===e||this._AddCellToOpenList(a+1,h-1,14),c||this._AddCellToOpenList(a+1,h,10),!n||c||u||this.At(a+1,h+1)===e||this._AddCellToOpenList(a+1,h+1,14),u||this._AddCellToOpenList(a,h+1,10),!n||u||o||this.At(a-1,h+1)===e||this._AddCellToOpenList(a-1,h+1,14)}return this._ClearIntermediateData(),null}_AddCellToOpenList(t,e,i){const n=s(t,e);if(this._closedSet.has(n))return;const l=this.At(t,e),a=this._openMap.get(n);a?this._currentNode._g+i+l<a._g&&this._UpdateNodeInOpenList(a,i,l):this._AddNewNodeToOpenList(t,e,i,l)}_UpdateNodeInOpenList(t,e,s){const i=this._openList,n=this._currentNode;i.Remove(t),t._parent=n,t._g=n._g+e+s,t._h=this._EstimateH(t._x,t._y),t._f=t._g+t._h,i.Add(t)}_AddNewNodeToOpenList(t,e,i,n){const l=new a(t,e),r=this._EstimateH(t,e),_=this._currentNode._g+i+n;l._h=r,l._g=_,l._f=r+_,l._parent=this._currentNode,this._openMap.set(s(t,e),l),this._openList.Add(l)}_EstimateH(t,e){return 10*Math.abs(t-this._targetX)+10*Math.abs(e-this._targetY)}_GetResultPath(t){const e=[];let s=!1,i=8,n=-1,l=t;for(;l;)0===e.length?(s=!0,l._parent&&(i=l.DirectionTo(l._parent),n=i)):l._parent?(n=l.DirectionTo(l._parent),s=n!==i):s=!1,s&&(e.push({x:l._x,y:l._y}),i=n),l=l._parent;return e.reverse()}}}
