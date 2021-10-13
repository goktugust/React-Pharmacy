import { useEffect, useState } from "react";
import { Card, Container, Dropdown, Grid, GridColumn } from "semantic-ui-react";
import { getIl, getIlce, getPharmacyApi } from "./Services";

interface IIl {
  SehirAd: string;
  SehirSlug: string;
}
interface IIlce {
  ilceAd: string;
  ilceSlug: string;
}

export interface IDetail {
  EczaneAdi: string;
  Adresi: string;
  Semt: string;
  YolTarifi: string;
  Telefon: string;
  Telefon2: string;
  Sehir: string;
  ilce: string;
  latitude: number;
  longitude: number;
}

function App() {
  // stateler
  const [ilState, setIlState] = useState<IIl[]>([]);
  const [ilceState, setIlceState] = useState<IIlce[]>([]);
  const [pharmacyState, setPharmacyState] = useState<IDetail[]>([]);
  const [ilSlug, setIlSlug] = useState("");
  const [status, setstatus] = useState(false);

  useEffect(() => {
    getAllData();
  }, []);

  // iller from api
  async function getAllData() {
    await getIl().then((res) => {
      const arr: IIl[] = [];
      res.data.data.map((item: IIl) => {
        return arr.push(item);
      });
      setIlState(arr);
    });
  }
  // apiden gelen iller optionlara atıldı
  const stateOptions = ilState.map((item, index) => ({
    key: index,
    text: item.SehirAd,
    value: item.SehirSlug,
  }));

  // slugname setstate for selected dropdown option
  async function slugNameForSelectedOption(cityName: string) {
    // eslint-disable-next-line array-callback-return
    await ilState.map((item) => {
      if (item.SehirAd === cityName) {
        console.log("item.SehirSlug :>> ", item.SehirSlug);
        setIlSlug(item.SehirSlug);
        getIlce(item.SehirSlug).then((res) => {
          const ilceArr: IIlce[] = [];
          // eslint-disable-next-line array-callback-return
          res.data.data.map((item: IIlce) => {
            ilceArr.push(item);
          });
          setIlceState(ilceArr);
        });
      }
    });
  }

  const ilceOptions = ilceState.map((item, index) => ({
    key: index,
    text: item.ilceAd,
    value: item.ilceSlug,
  }));

  async function slugNameForSelectedIlce(selectedIlce: any) {
    // eslint-disable-next-line array-callback-return
    await ilceState.map((item) => {
      if (item.ilceAd === selectedIlce) {
        console.log(item.ilceSlug);
        // setIlceSlug(item.ilceSlug);
        // console.log("adasds")
        if (ilSlug !== "") {
          console.log("object");
          getPharmacyApi(ilSlug, item.ilceSlug).then((res) => {
            console.log(res);
            const arrForPhar: IDetail[] = [];
            // eslint-disable-next-line array-callback-return
            res.data.data.map((item: IDetail) => {
              arrForPhar.push(item);
            });
            setPharmacyState(arrForPhar);
          });
        }
      }
    });
  }

  return (
    <>
      <Container>
      <Grid columns="2">
          <GridColumn>
            <Dropdown 
            onChange={(evt)=>{slugNameForSelectedOption(String(evt.currentTarget.children[0].textContent))}}
              placeholder="Şehir Seç"
              fluid
              search
              selection
              options={stateOptions}
            />
          </GridColumn>
          <GridColumn>
            <Dropdown
                onChange={(evt)=>{slugNameForSelectedIlce(String(evt.currentTarget.children[0].textContent))}}
              placeholder="İlçe Seç"
              fluid
              search
              selection
              options={ilceOptions}
            />
          </GridColumn>
        </Grid>
        <Grid columns="5" style={{ marginTop: 15 }}>
          {pharmacyState.map((item, index) => {
            return (
              <GridColumn key={index}>
                <Card>
                  <Card.Content header={item.EczaneAdi} />
                  <Card.Content description={item.Adresi} />
                  <Card.Content description={item.Telefon} />
                  <Card.Content
                    description={item.Sehir + " " + item.ilce + " " + item.Semt}
                  />
                </Card>
              </GridColumn>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}

export default App;
