import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScienceIcon from '@mui/icons-material/Science';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

const MenuNavi = () => {
    const [value, setValue] = React.useState(0);

    return (
        <BottomNavigation
            value={value}
            onChange={(_event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            style={{ position: 'fixed', bottom: 0, width: '100%', justifyContent: 'flex-start' }}
        >
            <BottomNavigationAction label="ペット管理" icon={<HomeIcon />} component={Link} to="/pets" />
            <BottomNavigationAction label="体重管理" icon={<FitnessCenterIcon />} component={Link} to="/weight" />
            <BottomNavigationAction label="通院記録" icon={<LocalHospitalIcon />} component={Link} to="/clinic" />
            {/* <BottomNavigationAction label="ワクチン情報" icon={<VaccinesIcon />} component={Link} to="/vaccination" /> */}
            <BottomNavigationAction label="尿検査" icon={<ScienceIcon />} component={Link} to="/urine-test" />
            <BottomNavigationAction label="設定" icon={<SettingsIcon />} component={Link} to="/configuration" />
            {/* <BottomNavigationAction label="投薬記録" icon={<MedicationIcon />} component={Link} to="/medication" />
            <BottomNavigationAction label="尿検査" icon={<ScienceIcon />} component={Link} to="/urine-test" />  */}
        </BottomNavigation>
    );
};

export default MenuNavi;
