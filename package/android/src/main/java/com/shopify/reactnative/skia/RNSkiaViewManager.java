package com.shopify.reactnative.skia;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.HashMap;

public class RNSkiaViewManager extends BaseViewManager<SkiaDrawView, LayoutShadowNode> {

    final private HashMap<SkiaDrawView, Integer> mViewMapping = new HashMap();

    @NonNull
    @Override
    public String getName() {
        return "ReactNativeSkiaView";
    }

    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        return new LayoutShadowNode();
    }

    @Override
    public Class<? extends LayoutShadowNode> getShadowNodeClass() {
        return LayoutShadowNode.class;
    }

    @Override
    public void updateExtraData(SkiaDrawView root, Object extraData) {
    }

    @ReactProp(name = "skiaId")
    public void setSkiaId(SkiaDrawView view, Integer skiaId) {
        RNSkiaModule skiaModule = ((ReactContext)view.getContext()).getNativeModule(RNSkiaModule.class);
        skiaModule.getSkiaManager().register(skiaId, view);
        mViewMapping.put(view, skiaId);
    }

    @ReactProp(name = "mode")
    public void setMode(SkiaDrawView view, String mode) {
        view.setMode(mode);
    }

    @ReactProp(name = "debug")
    public void setDebug(SkiaDrawView view, boolean show) {
        view.setDebugMode(show);
    }

    @Override
    public void onDropViewInstance(@NonNull SkiaDrawView view) {
        super.onDropViewInstance(view);
        RNSkiaModule skiaModule = ((ReactContext)view.getContext()).getNativeModule(RNSkiaModule.class);
        Integer nativeId = mViewMapping.get(view);
        skiaModule.getSkiaManager().unregister(nativeId);
        mViewMapping.remove(view);
        view.onRemoved();
    }

    @NonNull
    @Override
    protected SkiaDrawView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new SkiaDrawView(reactContext);
    }
}