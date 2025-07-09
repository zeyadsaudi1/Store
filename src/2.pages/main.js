import { Swiper, SwiperSlide } from "swiper/react";
import OpinionsData from '../5.API/opinions.json';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import '../4.style/page/main.css';

import { Pagination, Navigation, Autoplay, EffectFade } from "swiper/modules";
import CardProduct from "../1.components/cardProduct";
import CardOpinions from "../1.components/cardOpinions";
import { useContext, useEffect, useState } from "react";
import { Auth } from "../context/context";
import Logo from '../1.components/logo';

export default function Main() {
  const { loading2, curtains, API, mode} = useContext(Auth);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [preview, setPreview] = useState(4);
  const [preview2, setPreview2] = useState(4);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch(`${API}/getads`, {
      method: "GET",
      headers: {
        "Content-Type":"application/json",
      },
    }).then((res) => {
      if(res.ok) {
        return res.json()
      }
      else if(res.status === 404) {
        return null
      }
    }).then((res) => res !== null ? setAds(res.data) : null)
  },[])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // تحديث القيم بناءً على عرض النافذة
    if (windowWidth < 1092 && windowWidth > 815) {
      setPreview(3);
      setPreview2(3);
    } else if (windowWidth < 815 && windowWidth >= 545) {
      setPreview(2);
      setPreview2(2);
    } else if (windowWidth < 545) {
      setPreview(1);
      setPreview2(1);
    } else {
      setPreview(4);
      setPreview2(4);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth]);

  const GetProducts = (type, slide_prev = 1) => {
    if (!curtains || curtains.length === 0) return null; // تأكد من أن الـ curtains ليست فارغة

    return (
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={slide_prev}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {curtains.filter((el) => el.type === type).map((e, index) => (
          <SwiperSlide key={index}>
            <CardProduct
              id={e._id}
              aft={e.last_total}
              bef={e.aft_price_per_meter}
              img={e.subPhoto}
              cat={e.category}
              title={e.title}
              type={e.type}
              color={e.color}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };
  console.log(ads.slice(ads.length - 1))
  return (
    <div className="main" style={{ width: "100%", margin: "0 auto" }}>
    <Swiper
  spaceBetween={50}
  slidesPerView={1}
  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
  }}
>
  {ads.length === 0 ? 
  <div className="loadingAds">
    <Logo size={200} />
    <p>شاهد اعلانات ويفي <i className="fa fa-spinner fa-spin"></i></p>
  </div>
  :
  ads.slice(ads.length - 1).map((e, i) => (
    <SwiperSlide key={i}>
      <div 
        onClick={() => window.location.href = e.url} 
        className="bg-ad" 
        style={{ backgroundImage: `url(${e.img})` }}
      >
        <p className="content">{e.title}</p>
      </div>
    </SwiperSlide>
  ))
  }
</Swiper>
      <div className="special-customers">
        <h3>بعض العملاء<i className="fa-solid fa-trophy"></i></h3>
        <div className="cus-parent">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={4}
                autoplay={{
                    delay: 2000, 
                    disableOnInteraction: false, 
                }}
                centeredSlides={true}
                loop={true} 
                breakpoints={{
                    260: { slidesPerView: 1 }, 
                    640: { slidesPerView: 2 }, 
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
            >
                <SwiperSlide>
                    <div
                        style={{
                            backgroundImage: `url(${require('../3.public/cusotmers/bg-remove/iberotelluxor-removebg-preview.png')})`,
                        }}
                        className="cus cus2"
                    ></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        style={{
                            backgroundImage: `url(${require('../3.public/cusotmers/bg-remove/Laguna-removebg-preview.png')})`,
                        }}
                        className="cus cus3"
                    ></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        style={{
                            backgroundImage: `url(${require('../3.public/cusotmers/bg-remove/naifalrajhiinv-removebg-preview.png')})`,
                        }}
                        className="cus cus4"
                    ></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        style={{
                            backgroundImage: `url(${require('../3.public/cusotmers/bg-remove/fairmont-removebg-preview.png')})`,
                        }}
                        className="cus cus5"
                    ></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        style={{
                            backgroundImage: `url(${require('../3.public/cusotmers/bg-remove/karaz.png')})`,
                        }}
                        className="cus cus6"
                    ></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                        }}
                        className="cus cus5"
                    >
                        شركة الشالوحي للمقولات
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
      </div>
      {loading2 ? 
      <>
      
      <div className="products">
        <h2>ستائر الرول</h2>
        {GetProducts('ستائر رول', preview)}
      </div>
      <div className="products">
        <h2>ستائر خشبية</h2>
        {GetProducts('خشبي', preview)}
      </div>
      <div className="products">
        <h2>مظلة سكإي لايت</h2>
        {GetProducts('سكي لايت', preview)}
      </div>
      <div className="products">
        <h2>السائر معدنية</h2>
        {GetProducts('معدني', preview)}
      </div>
      </>
      :
      null
      }

      <div className="opinions">
        <h3><i className="fa-solid fa-comment"></i> تقييمات العملاء</h3>
        <div className="opin-parent">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={preview2}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
          >
            {OpinionsData.map((e, index) => (
              <SwiperSlide key={index}>
                <CardOpinions fullName={e.name} comment={e.comment} img={e.img} rate={e.rating} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
