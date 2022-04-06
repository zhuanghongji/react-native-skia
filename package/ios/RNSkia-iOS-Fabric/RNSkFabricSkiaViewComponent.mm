#import "RNSkFabricSkiaViewComponent.h"

#import <react/renderer/components/rnskia/EventEmitters.h>
#import <react/renderer/components/rnskia/Props.h>
#import <react/renderer/components/rnskia/RCTComponentViewHelpers.h>
#import <react/renderer/components/rnskia/ComponentDescriptors.h>
#import <react/renderer/components/rnskia/ShadowNodes.h>

#import "RCTConversions.h"
#import "RCTFabricComponentsPlugins.h"

#import <React/RCTBridge+Private.h>
#import <RNSkiaModule.h>
#import <SkiaDrawView.h>
#import <RNSkManager.h>

using namespace facebook::react;

@interface RNSkFabricSkiaViewComponent () <RCTReactNativeSkiaViewViewProtocol>
@end

@implementation RNSkFabricSkiaViewComponent {
  ReactNativeSkiaViewShadowNode::ConcreteState::Shared _state;
  SkiaDrawView* _drawView;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ReactNativeSkiaViewProps>();
    _props = defaultProps;
    
    // Get the Skia module
    auto skiaModule = (RNSkiaModule*)[RCTBridge.currentBridge moduleForName:@"RNSkia"];
    if(skiaModule != NULL) {
      _drawView = [[SkiaDrawView alloc] initWithManager:[skiaModule manager].skManager.get()];
      _drawView.frame = self.bounds;
      [self addSubview:_drawView];
    }
  }

  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<ReactNativeSkiaViewComponentDescriptor>();
}

- (void)updateState:(State::Shared const &)state oldState:(State::Shared const &)oldState
{
  _state = std::static_pointer_cast<ReactNativeSkiaViewShadowNode::ConcreteState const>(state);
}

- (void)updateProps:(const facebook::react::Props::Shared &)props oldProps:(const facebook::react::Props::Shared &)oldProps {
  [super updateProps:props oldProps:oldProps];
  
  const auto &newSkiaViewProps = *std::static_pointer_cast<const ReactNativeSkiaViewProps>(props);
  
  if(_drawView != NULL) {
    [_drawView setNativeId:static_cast<size_t>(newSkiaViewProps.skiaId)];
    if(newSkiaViewProps.mode == ReactNativeSkiaViewMode::Continuous) {
      [_drawView setDrawingMode:"continuous"];
    } else {
      [_drawView setDrawingMode:"default"];
    }
    [_drawView setDebugMode:newSkiaViewProps.debug];
  }
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  if(_drawView != NULL) {
    [_drawView removeFromSuperview];
    _drawView = NULL;
  }
  _state.reset();
}

- (void) layoutSubviews {
  if(_drawView != NULL) {
    _drawView.frame = self.bounds;
  }
}

@end

Class<RCTComponentViewProtocol> ReactNativeSkiaViewCls(void)
{
  return RNSkFabricSkiaViewComponent.class;
}
