import './styles/palette.css';
import './styles/offset.css';
import './styles/light-theme.css';
import './styles/transition.css';

import { goodsPageHandler, isGoodsPage } from './pages/storage/goods';


const pathParts = location.pathname.split('/');

if (isGoodsPage(pathParts)) {
    goodsPageHandler();
}