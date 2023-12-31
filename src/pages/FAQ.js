import { Link } from 'react-router-dom';
import { useWindowSize } from 'react-use';
// import useModal from '../hooks/useModal';
import './FAQ.sass';

const FAQ = () => {

    // const { sendModal } = useModal();

    const data = [
        {title: "什麼是 NFT？", content: "NFT（Non-Fungible Token）為非同質化代幣，是一種基於區塊鏈技術的數位資產。與傳統的加密貨幣不同，每個 NFT 都代表著一個獨特的且不可分割的資產，例如：藝術品、圖片、影片、音樂或甚至遊戲道具、會員卡等賦能型資產。"},
        {title: "如何購買 NFT？", content: "在 UniFunn 中，我們支援信用卡支付。未來將會陸續開通更多元的新台幣支付模式。"},
        {title: "購買 NFT 前，我需要先建立並開通錢包嗎？", content: "購買前須先註冊成為 UniFunn 會員，我們會為您建立一個專屬的錢包，步驟簡單讓您能快速上手。"},
        {title: "購買 NFT 有什麼延伸費用嗎？", content: "在 UniFunn 裡購買的商品是沒有其他延伸費用的，商品頁面上的標價即是最終價格。"}, 
        {title: "成為會員後，我可以做什麼？", content: "成為會員後，您的會員等級預設會是「一般會員」，能進行 NFT 交易並能管理您在平台上的點數，包含：購買或轉送點數。"}, 
        {title: "會員制度是什麼？有哪些不同等級？", content: "可以分為一般會員與創作者會員，一般會員的權限可參考上題，而創作者會員則是可以自由地在平台上架您的創作品或是賦能項目。不過，要成為創作者會員需要先經過平台審核，這是 UniFunn 對於平台內容的管控機制。如您欲升級成創作者，可點選「升級帳號」進入申請，審核結果會另發信告知並會與您主動聯繫。"}, 
        {title: "我已是創作者，我該如何上架我的商品或項目？", content: "您須先從「我的藝術品」中的「新增系列」開始，新增成功後便能在該系列中上傳您的商品或項目，上述步驟都完成後，商品即預設為「上架」狀態，您可自行調整商品是否維持「上架」或是暫時「下架」。"}, 
        {title: "購買後我要如何看到我的 NFT？", content: "在「我的藝術品」下即能瀏覽所有您所創作或購買的商品或項目。"}, 
        {title: "購買後我要如何重新上架我的 NFT 進行銷售？", content: "在「我的藝術品」下的「已擁有的藝術品」類別中，可直接透過「編輯」更新該商品或項目的上架狀態。"}, 
        {title: "已購買的 NFT 是否可退貨？", content: "本平台提供交易之 NFT 商品，依我國消費者保護法第 19 條第 2 項規定所訂定「通訊交易解除權合理例外情事適用準則」中第 2 條第 5 款之規定，屬於「非以有形媒介提供之數位內容」，一經提供即為完成線上服務，您不得主張消保法之鑑賞期並要求辦理退貨退款。"}, 
        {title: "已購買的 NFT，可以轉移至其他人或是其他錢包嗎？", content: "可以，您可以將已購買的 NFT 轉送給同為平台會員的任何人，在「已擁有的藝術品」中選擇您要轉移的 NFT 進入頁面後，點選「轉移」，並填上「接收者地址」(該對象註冊時使用的電子郵件)，即可完成轉移，轉移成功後該 NFT 的擁有權也將轉予他人。"}, 
        {title: "如何保持安全並保護我的 NFT？", content: "因平台有管控機制，所以您可以放心平台上的內容不會涉及暴力或色情內容。錢包金鑰也統一由平台保管，您可以放心不會有錢包遺失的風險。"}, 
        {title: "我是創作者，如果想與 UniFunn 合作上架我的作品，該怎麼進行呢？", content: "平台提供創作者一個友善、方便且合理的環境販售作品，如您有意願做進一步合作，可透過平台提供的聯絡方式聯繫我們，平台將有專人主動與您聯繫相關合作事宜。"}, 
    ];
    return (
        <div style={{ marginBlock: '0px' }}>
            <h1>常見問答集</h1>
            {/* <button onClick={() => sendModal('Hi')}>Trigger</button> */}
            <div className="faq-wrapper" style={{ fontSize: '21px', lineHeight: '2.7rem' }}>
                {data.map((item, i) => (
                    <details key={ `FAQ_${i}`}>
                        <summary>{ item.title }</summary>
                        { item.content }
                    </details>
                ))}
            </div>
        </div>
    )
}

export default FAQ;