export interface EnvironmentConfig {
    production: boolean;
    apiURL: string;
    accountsUrl:string;
    plinkURL: string;
    firebaseConfig: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId: string;
    };
    apiEndPoints: {
        signUpUser: string;
        userLogOut: string;
        // sendOtp: string;
        verifyOtp: string;
        resendAuthOtp: string;
        generateOtp: string;
        generateOtpEditProfile: string;
        InactiveAccount: string;

        //*********************** Mosques End Points ***********************//

        getAllMosqueList: string;
        getAllMosqueListFilter: string;
        addNewMosque: string;
        sendMosqueOnboardRequest: string;
        getMosqueDetails: string;
        getMosqueDetailsWP: string;
        deactivateMosque: string;
        assignRoleUserToMosque: string;
        updateExistingMosqueDetails: string;
        searchUsersForAdminAssign: string;
        getMosquesAssignedForUser: string;
        uploadMosqueProfileOrCoverImage: string;
        uploadMosqueCoverImage: string;
        getCoverPhotosForMosque:string;
        deleteMosqueCoverImages:string;
        getMosqueMembers: string;
        verifyUserExistAsMember: string;
        getAssignedMosqueKeyMembers: string;
        addMosqueMember: string;
        updateMosquememberDetails: string;
        getMosqueMemberInfo: string;
        getVerseOfTheDay: string;
        addOrEditVerseOfTheDay: string;
        getKeyMemberTypes: string;
        getAllMosques: string;
        getCompleteMosqueDetails: string;
        getCompleteMosqueDetailsWNP: string;
        getNextPrayerForMosque: string;
        getUnAssignedAdminsForMosque: string;
        assignAdminForMosque: string;
        getEssentialProducts: string;
        getFollowerList: string;
        toFollowMosque: string;
        getOnboardMosqueList:string;
        approveOnboardRequest:string;
        googleAuthentication:string;
        dailyAyathData:string;
        getHaditTopics:string;
        hadithTopicById:string;

        //*********************** User Management End Points ***********************//

        getAllUsersList: string;
        getAllRolesList: string;
        updateUserStatus: string;
        getUserProfileById: string;
        uploadUserProfileImage: string;
        updateUserProfile: string;
        getAllRoles: string;
        getMenuBasedOnRoleId: string;
        addOrUpdateRole: string;
        getUserActivitiesById: string;
        unRegisterDeviceId: string;
        deRegisterAll: string;
        getAllBanksList: string;
        getMosqueQrInfo: string;
        addMosqueBank: string;

        //*********************** Prayer End Points ***********************//

        getPrayersTimings: string;
        getWeatherReport: string;
        switchUserRole: string;
        getImamMasters: string;
        addImamProfile: string;
        getImamProfileData: string;
        verifyImamProfile: string;
        getUserProfileData: string;
        getTodayAttendies: string;

        //*********************** Common End Points ***********************//

        getLocationsBySearch: string;
        getUserNotifications: string;
        getAvailableLanguages: string;
        getAllTraslations: string;
        updateTranslationRecord: string;
        InactiveMosqueBank: string;

        //*********************** Donations End Points ***********************//
        getDonationTypes: string;
        savePaymentDetailsById: string;
        getAllTransactions: string;
        loaZakathData: string;
        zakatCalculation: string;
        calculationByZakatId: string;
        deleteCalculation: string;
        getUserCurrencyType: string;
        getUserDonationTypes: string;
        updateUserCurrencyType: string;
        getUpcomingEventsForMosque: string;
        donationConfirm: string;
        plinkTransactionCallDetails: string;
        checkRegMosqueXendit: string;
        registerMosqueForXenditt: string;
        callXendittForDonation: string;
        getAllMasjidPayOuts: string;
        getAllXenditTransactions: string;
        getAllPaymentTransactions: string;
        getMosqueAvailableBalance: string;
        getMosqueBankDetails: string;
        payOutXenditt: string;
        workOrderPaymentAms: string;
        getDonationChartDetails: string;

        //*********************** Master Data End Points ***********************//

        getAllParentCategories: string;
        getChildCategories: string;
        getAllProductsByCategories: string;
        addCategories: string;
        addProducts: string;
        getProductUom: string;
        activeInactiveCategoryProduct: string;
        donateAssetForMosque: string;
        donatedProductStatus: string;
        masterCurrencyTypes: string;
        getAccessLevels: string;
        getAssetInvoice: string;
        getPendingAssets: string;
        getAllProductsThresholdByCategory: string;
        getThrsholdProductsByMosque: string;
        addUpdateThrsholdProducts: string;
        getMosqueTypes: string;
        getMasterLocations: string;
        facilityResources: string;
        getCountries: string;
        getLocations: string;
        getAllPurposeDataList: string;
        addPurposeData: string;
        updatePurposeData: string;
        getAllBankChargesList: string;
        getBanksForPaymentMode: string;
        getBanksCharges: string;
        getAllParentCategoriesFilter:string;
        getChildCategoriesFilter:string;
        getAllProdsByCatFilter:string;

        //*********************** Menu Management End Points ***********************//

        getNavigationList: string;
        addNewRoleMenuAction: string;
        deleteRoleMenuAction: string;
        getBusinessActions: string;
        getChildMenus: string;
        getParentMenuList: string;
        getChildMenusById: string;
        addParentMenu: string;
        addChildMenu: string;
        getAllBusinessActions: string;
        addOrUpdateBusinessActions: string;
        activeInactiveMenu: string;

        //*********************** Inventory Management End Points ***********************//
        getAllSuppliers: string;
        addOrUpdateSuppliers: string;
        activeInactiveSupplier: string;
        getAllInventoryProducts: string;
        addMosqueInventoryProduct: string;
        activeOrInactiveInventory: string;
        inventoryTransaction: string;
        stockOutInventoryProduct: string;
        uploadInvoice: string;

        createServiceCall: string;
        getVendorDetails: string;
        getAllVendorDataList: string;
        getServiceCallList: string;
        getServiceCallChildList: string;
        updateServiceCallId: string;
        serviceCallIdStatusUpdate: string;
        getWorkOrderCounts: string;
        estimatedAmountAccept: string;

        //*********************** Event Management End Points ***********************//

        getAllEvents: string;
        getEventsByMonth: string;
        createNewEvent: string;
        updateExistingEventDetails: string;
        getEventDetailsById: string;
        updateEventStatus: string;
        getUpcomingEvents: string;

        //*********************** Gallery End Points ***********************//
        getIslamicMediaChannels: string;
        addIslamicChannel: string;
        addIslamicVideo: string;
        getVideosAndArticles: string;
        getMediaGalleryImages: string;
        uploadMediaGallery: string;
        deleteMediaGallery: string;
        deleteMediaGalleryVideos: string;
        deleteMediaGalleryChannels: string;
        downloadImage: string;
        partnerSignIn: string;
        partnerOAuth: string;
        energyCosumption: string;
        switchQueryData: string;
        updateSwitchData: string;
        TemperatureSensor: string;
        PartnerRefreshToken: string;
        SetAcTemperature: string;
    };
    imageEndPoints: {
        logo: string;
        menuLogo: string;
        menuRightLogo: string;
        menuLogoWithText: string;
        profileCoverImage: string;
        profileOverlayImage: string;
        dProfileOverlayImage: string;
        loginLogo: string;
        languageName: string;
        language_arabic: string;
        browseIcon: string;
        language: string;
        activeIcon: string;
        pendingVerification: string;
        prayer_timing_sun: string;
        deactive: string;
        moreIcon: string;
        checkIcon: string;
        alertIcon: string;
        donation_mosque: string;
        donation_Amount_Icon: string;
        eventsBanner: string;
        ministryEvent: string;
        ministryEventInactive: string;
        mosqueEvent: string;
        mosqueEventInactive: string;
        dashboardSunIcon: string;
        dashboardProfile: string;
        verseOfTheDayIcon: string;
        verseOfTheDay: string;
        reloadIcon: string;
        deleteIcon: string;
        noMemberImage: string;
        defaultMosqueImg: string;
        sampleExcel: string;
        menuIcons: {
            ministry: string;
            user: string;
            prayers: string;
            events: string;
            donations: string;
            reports: string;
            otherServices: string;
            techSupport: string;
        };
        zakatCalculator: string;
        trashIcon: string;
        assetDonation: string;
        thresholdAsset: string;
        powerIcon: string;
        temperatureIcon: string;
        AirConditioner: string;
        waterDropIcon: string;
        followerIcon: string;
        attendiesIcon: string;
        bankImage: string;
    };
    redirectDonationURL: string;
    mosqueLaunchURL: string;
    shareMosqueUri: string;
    GoogleMapAPIKey: string;
    redirectPartnerURL: string;
}
