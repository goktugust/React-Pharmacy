import axios from "axios";

//  const apiToken = 'oVkqoUHLscoxBgOUdXkwDQFEAt1MtqkJXaM9KeA9ezExd0jz6prbANOKUmdO';
const apiToken = 'Pp4xCoBXFePcujQZqbhrKRIZntLxLTRZyIEMTteFEHcfzfyYcpgBIxPYwvxH';

export const service = axios.create({
    baseURL: "/apiv2/pharmacy",
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer '+ apiToken,
    }
    
});

export function getIl(){
    var prm:any = {
        method: 'get',
        url: '/city',        
    }
    return service(prm)
}

export function getIlce(il:string){
    var prm:any = {
        method: 'get',
        url: `/city?city=${il}`
    }
    return service(prm)
}
export function getPharmacyApi(il:string, ilce:string){
    var prm:any = {
        method: 'get',
        url: `/list?city=${il}&county=${ilce}`
    }
    return service(prm)
}
