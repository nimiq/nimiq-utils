type BookType = {
    [k: string]: string
}

export class AddressBook {
    static BOOK: BookType = {
        // Mainnet Pools
        'NQ48 8CKH BA24 2VR3 N249 N8MN J5XX 74DB 5XJ8': 'Skypool',
        'NQ58 U4HN TVVA FCRS VLYL 8XTL K0B7 2FVD EC6B': 'Skypool Gundam',
        'NQ88 D1R3 KR4H KSY2 CQYR 5G0C 80X4 0KED 32G8': 'Skypool Bebop',
        'NQ43 GQ0B R7AJ 7SUG Q2HC 3XMP MNRU 8VM0 AJEG': 'Skypool Pandaman',
        'NQ74 FLQL DRE3 99PF CET0 3N7D JKLF MQP6 87KS': 'Skypool SamuraiChamploo',
        'NQ46 UTKP D8A9 04RS A1LL GPR8 BE4L G2BD FYSX': 'Skypool Hehe',
        'NQ32 473Y R5T3 979R 325K S8UT 7E3A NRNS VBX2': 'SushiPool',
        'NQ89 T8SS SE0B SS5L GRH0 J849 LQ0L 3J6N RAFU': 'SushiPool',
        'NQ76 R7R0 DCKG N0RC 35XK ULTS N41J VGA7 3CMP': 'Porky Pool',
        'NQ10 76JC KSSE 5S2R U401 NC5P M3N2 8TKQ YATP': 'Nimiqchain.info Pool',
        'NQ33 DH76 PHUK J41Q LX3A U4E0 M0BM QJH9 QQL1': 'Beeppool',
        'NQ90 P00L 2EG5 3SBU 7TB5 NPGG 8FNL 4JC7 A4ML': 'NIMIQ.WATCH Pool',
        'NQ11 P00L 2HYP TUK8 VY6L 2N22 MMBU MHHR BSAA': 'Nimpool.io',
        'NQ04 3GHQ RAV6 75FD R9XA VS7N 146Q H230 2KER': 'Nimiqpool.com',
        'NQ07 SURF KVMX XF1U T3PH GXSN HYK1 RG71 HBKR': 'Nimiq.Surf',
        'NQ90 PH1L 7MT2 VTUH PJYC 17RV Q61B 006N 4KP7': 'PhilPool',
        'NQ06 NG1G 83YG 5D59 LK8G Y2JB VYTH EL6D 7AKY': 'Nimbus Pool',
        'NQ18 37VM K2Y5 2HPY 5U80 2E0U VHUJ R7RK QSNE': 'Sirius Pool',
        'NQ64 55BR 87SX AFHN XB27 M7BQ F7CY L4FV 2TG2': 'HexaPool',
        'NQ67 AQB4 RHCC AU2T 4CC0 ETUT X1XB SSFL V9UQ': 'mineNIM Pool',
        'NQ37 47US CL1J M0KQ KEY3 YQ4G KGHC VPVF 8L02': 'Nimiqpocket Pool',
        'NQ24 900S EKCD HGDA TN30 8UET LX2F 75U1 G1A1': 'Nimiqo.com',
        'NQ88 QEC9 5MDH T2SB V70A GB76 MGRT STSB LN9A': 'X Pool',
        'NQ26 GF56 N02Y 2TUC D11J TPB6 Q7VJ 0EG5 3PU4': 'My Nimiq Pool',
        'NQ04 XEHA A84N FXQ4 DPPE 82PG QS63 TH1X XCHQ': 'IceMining Pool',

        // Mainnet Services
        'NQ15 MLJN 23YB 8FBM 61TN 7LYG 2212 LVBG 4V19': 'NIM Activation',
        'NQ09 VF5Y 1PKV MRM4 5LE1 55KV P6R2 GXYJ XYQF': 'Nimiq Foundation',
        'NQ19 YG54 46TX EHGQ D2R2 V8XA JX84 UFG0 S0MC': 'Nimiq Charity',
        'NQ93 RL4N M68G 9DEN CKU9 HJRE HYRJ CYRE J0XB': 'nimiqfaucet.io',
        'NQ94 GSXP KNG0 K5YV HFJ1 PYAQ Y5D1 XTQ1 SLFP': 'Nimiq-Faucet.surge.sh',
        'NQ80 PAYN R93R D0H4 BH8T KPRT SBYE 30A3 PHDL': 'PayNim.app',
        'NQ85 TEST VY0L DR6U KDXA 6EAV 1EJG ENJ9 NCGP': 'Discord NIM Tip Bot',
        'NQ26 NMK7 R4EA KSV2 67Q2 5L4T DVDS FR5E NX7B': 'Nimiq Shop',
        'NQ02 YP68 BA76 0KR3 QY9C SF0K LP8Q THB6 LTKU': 'Nimiq Faucet',
        'NQ23 3RK3 U8KF 72NS SPNX H0R3 E9HQ 68AB SHAQ': 'Nimbet.cc',
        'NQ07 R0NG UTD5 P187 6YLK CD3H EMGF EDAC LFUS': 'GetNIM',

        // Testnet
        'NQ31 QEPR ED7V 00KC P7UC P1PR DKJC VNU7 E461': 'pool.nimiq-testnet.com',
        'NQ36 P00L 1N6T S3QL KJY8 6FH4 5XN4 DXY0 L7C8': 'NIMIQ.WATCH Test-Pool',
        'NQ50 CXGC 14C6 Y7Q4 U3X2 KF0S 0Q88 G09C PGA0': 'SushiPool TESTNET',
        'NQ26 XM1G BFAD PACE R5L0 C85L 6143 FD8L 82U9': 'Nimiq Shop (Testnet)',
        'NQ76 F8M9 1VJ9 K88B TXDY ADT3 F08D QLHY UULK': 'Nimiq Bar',
    };

    static getLabel(address: string) {
        return AddressBook.BOOK[address] || null;
    }
}
